

ymaps.ready(function () {
    // Пример реализации собственного элемента управления на основе наследования от collection.Item.
    // Элемент управления отображает название объекта, который находится в центре карты.
    var geolocation = ymaps.geolocation,
    map = new ymaps.Map("map", {
        center: [55.819543, 37.611619],
        zoom: 6,       
        // Тип покрытия карты: "Спутник".
        
    }, {
        searchControlProvider: 'yandex#search'
    }),
        // Создаем собственный класс.
        CustomControlClass = function (options) {
            CustomControlClass.superclass.constructor.call(this, options);
            this._$content = null;
            this._geocoderDeferred = null;
        };
    // И наследуем его от collection.Item.
    ymaps.util.augment(CustomControlClass, ymaps.collection.Item, {
        onAddToMap: function (map) {
            CustomControlClass.superclass.onAddToMap.call(this, map);
            this._lastCenter = null;
            this.getParent().getChildElement(this).then(this._onGetChildElement, this);
        },

        onRemoveFromMap: function (oldMap) {
            this._lastCenter = null;
            if (this._$content) {
                this._$content.remove();
                this._mapEventGroup.removeAll();
            }
            CustomControlClass.superclass.onRemoveFromMap.call(this, oldMap);
        },

        _onGetChildElement: function (parentDomContainer) {
            // Создаем HTML-элемент с текстом.
            this._$content = $('<div class="btn-group">' +
                '<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                'Отобразить' +
                '</button>' +
                '<div class="dropdown-menu dropdown-menu-right">' +
                '<button class="dropdown-item" type="button">Районы выезда</button>' +
                '<button class="dropdown-item" type="button">Гидранты</button>' +
                '<button class="dropdown-item" type="button">Объекты</button>' +
                '<button class="dropdown-item" type="button">Безводные участки</button></div></div>').appendTo(parentDomContainer);          
        },
        
    });


    //Находим геолакацию пользователя
    geolocation.get({
        provider: 'browser',
        mapStateAutoApply: true
    }).then(function (result) {
        // Синим цветом пометим положение, полученное через браузер.
        // Если браузер не поддерживает эту функциональность, метка не будет добавлена на карту.

        result.geoObjects.options.set('preset', 'islands#geolocationIcon');
        map.geoObjects.add(result.geoObjects);
    });

    var customControl = new CustomControlClass();
    map.controls.add(customControl, {
        float: 'none',
        position: {
            top: 60,
            right: 10
        }
    });
});