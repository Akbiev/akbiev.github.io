(function () {
    'use strict';

    function rtv_15(object) {
      var network = new Lampa.Reguest();
      var scroll = new Lampa.Scroll({
        mask: true,
        over: true,
        step: 250
      });
      var items = [];
      var html = $('<div></div>');
      var body = $('<div class="category-full"></div>');
      var info;
      var last;
      var waitload;

      this.create = function () {
        var _this = this;

        this.activity.loader(true);
        network.silent(object.url, this.build.bind(this), function () {
          var empty = new Lampa.Empty();
          html.append(empty.render());
          _this.start = empty.start;

          _this.activity.loader(false);

          _this.activity.toggle();
        });
        return this.render();
      };

      this.next = function () {
        var _this2 = this;

        if (waitload) return;

        if (object.page < 1) {
          waitload = true;
          object.page++;
          network.silent(object.url + '?pg=' + object.page, function (result) {
            _this2.append(result);

            if (result.length) waitload = false;
            Lampa.Controller.enable('content');
          });
        }
      };

      this.append = function (data) {
        var _this3 = this;

        data.forEach(function (element) {
          var card = Lampa.Template.get('card', {
            title: element.name,
            release_year: element.time + (element.quality ? ' / ' + element.quality : '')
          });
          card.addClass('card--collection');
          card.find('.card__img').attr('src', element.picture);
          card.on('hover:focus', function () {
            last = card[0];
            scroll.update(card, true);
            info.find('.info__title').text(element.name);
            info.find('.info__title-original').text(element.time + (element.quality ? ' / ' + element.quality : ''));
            var maxrow = Math.ceil(items.length / 10) - 1;
            if (Math.ceil(items.indexOf(card) / 10) >= maxrow) _this3.next();
          });
          card.on('hover:enter', function () {
            var video = {
              title: element.name,
              url: element.video
            };
            Lampa.Player.play(video);
            Lampa.Player.playlist([video]);
          });
          body.append(card);
          items.push(card);
        });
      };

      this.build = function (data) {
        info = Lampa.Template.get('info');
        info.find('.info__rate,.info__right').remove();
        scroll.render().addClass('layer--wheight').data('mheight', info);
        html.append(info);
        html.append(scroll.render());
        this.append(data);
        scroll.append(body);
        this.activity.loader(false);
        this.activity.toggle();
      };

      this.start = function () {
        Lampa.Controller.add('content', {
          toggle: function toggle() {
            Lampa.Controller.collectionSet(scroll.render());
            Lampa.Controller.collectionFocus(last || false, scroll.render());
          },
          left: function left() {
            if (Navigator.canmove('left')) Navigator.move('left');else Lampa.Controller.toggle('menu');
          },
          right: function right() {
            Navigator.move('right');
          },
          up: function up() {
            if (Navigator.canmove('up')) Navigator.move('up');else Lampa.Controller.toggle('head');
          },
          down: function down() {
            if (Navigator.canmove('down')) Navigator.move('down');
          },
          back: function back() {
            Lampa.Activity.backward();
          }
        });
        Lampa.Controller.toggle('content');
      };

      this.pause = function () {};

      this.stop = function () {};

      this.render = function () {
        return html;
      };

      this.destroy = function () {
        network.clear();
        scroll.destroy();
        if (info) info.remove();
        html.remove();
        body.remove();
        network = null;
        items = null;
        html = null;
        body = null;
        info = null;
      };
    }

    function startrtv_15() {
      window.plugin_rtv_15_ready = true;
      Lampa.Component.add('rtv_15', rtv_15);
      var catalogs = [{
        title: '4K',
        url: 'http://9ak.ru/v/4k/'
      }, {
        title: 'Р”РµС‚СЃРєРёРµ',
        url: 'http://9ak.ru/v/det/'
      }, {
        title: 'РљРёРЅРѕ',
        url: 'http://9ak.ru/v/kin/'
      }, {
        title: 'РњСѓР·С‹РєР°Р»СЊРЅС‹Рµ',
        url: 'http://9ak.ru/v/muz/'
      }, {
        title: 'РџРѕР·РЅР°РІР°С‚РµР»СЊРЅС‹Рµ',
        url: 'http://9ak.ru/v/pos/'
      }, {
        title: 'Р Р°Р·РІР»РµРєР°С‚РµР»СЊРЅС‹Рµ',
        url: 'http://9ak.ru/v/raz/'
      }, {
        title: 'РЎРїРѕСЂС‚РёРІРЅС‹Рµ',
        url: 'http://9ak.ru/v/spo/'
      }, {
        title: 'Р РµР»Р°РєСЃ',
        url: 'http://9ak.ru/v/rel/'
      }, {
        title: 'РЈРєСЂР°РёРЅСЃРєРёРµ',
        url: 'http://9ak.ru/v/ukrl/'
      }];
      Lampa.Listener.follow('app', function (e) {
        if (e.type == 'ready') {var ico = '<svg width="16px" height="16px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" color="#fff" fill="currentColor" class="bi bi-tv"><path d="M2.5 13.5A.5.5 0 0 1 3 13h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zM13.991 3l.024.001a1.46 1.46 0 0 1 .538.143.757.757 0 0 1 .302.254c.067.1.145.277.145.602v5.991l-.001.024a1.464 1.464 0 0 1-.143.538.758.758 0 0 1-.254.302c-.1.067-.277.145-.602.145H2.009l-.024-.001a1.464 1.464 0 0 1-.538-.143.758.758 0 0 1-.302-.254C1.078 10.502 1 10.325 1 10V4.009l.001-.024a1.46 1.46 0 0 1 .143-.538.758.758 0 0 1 .254-.302C1.498 3.078 1.675 3 2 3h11.991zM14 2H2C0 2 0 4 0 4v6c0 2 2 2 2 2h12c2 0 2-2 2-2V4c0-2-2-2-2-2z"/></svg>';
           var menu_item = $('<li class="menu__item selector focus" data-action="rtv_15"><div class="menu__ico">' + ico + '</div><div class="menu__text">РўР’</div></li>');
          menu_item.on('hover:enter', function () {
            Lampa.Select.show({
              title: 'РљР°С‚РµРіРѕСЂРёРё',
              items: catalogs,
              onSelect: function onSelect(a) {
                Lampa.Activity.push({
                  url: a.url,
                  title: a.title,
                  component: 'rtv_15',
                  page: 1
                });
              },
              onBack: function onBack() {
                Lampa.Controller.toggle('menu');
              }
            });
          });
          $('.menu .menu__list').eq(0).append(menu_item);
        }
      });
    }

    if (!window.plugin_rtv_15_ready) startrtv_15();

})();
