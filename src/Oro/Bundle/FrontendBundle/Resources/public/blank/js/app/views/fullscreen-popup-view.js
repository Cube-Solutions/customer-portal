define(function(require) {
    'use strict';

    var FullscreenPopupView;
    var BaseView = require('oroui/js/app/views/base/view');
    var tools = require('oroui/js/tools');
    var mediator = require('oroui/js/mediator');
    var _ = require('underscore');
    var $ = require('jquery');

    FullscreenPopupView = BaseView.extend({
        keepElement: true,

        optionNames: BaseView.prototype.optionNames.concat([
            'template', 'templateSelector', 'templateData',
            'content', 'contentElement', 'contentSelector', 'contentView', 'contentOptions'
        ]),

        templateSelector: '#fullscreen-popup-tpl',

        templateData: {
            label: _.__('Back'),
            closeOnLabel: true,
            close: true
        },

        content: null,

        contentElement: null,

        contentElementPlaceholder: null,

        contentSelector: null,

        contentView: null,

        contentOptions: null,

        events: {
            'click': 'show'
        },

        $popup: null,

        /**
         * @inheritDoc
         */
        initialize: function() {
            FullscreenPopupView.__super__.initialize.apply(this, arguments);
        },

        /**
         * @inheritDoc
         */
        dispose: function() {
            this.close();
            FullscreenPopupView.__super__.dispose.apply(this, arguments);
        },

        show: function() {
            this.close();
            this.$popup = $(this.getTemplateFunction()(this.getTemplateData()));

            this.contentOptions = _.extend({}, this.contentOptions || {}, {
                el: this.$popup.find('[data-role="content"]').get(0)
            });

            this.$popup.appendTo($('body'));

            this.renderPopupContent(_.bind(this.onShow, this));
        },

        onShow: function() {
            this.initPopupEvents();
            mediator.trigger('layout:reposition');
            this.trigger('show');
        },

        renderPopupContent: function(callback) {
            if (this.content) {
                this.renderContent(callback);
            } else if (this.contentElement) {
                this.moveContentElement(callback);
            } else if (this.contentSelector) {
                this.renderSelectorContent(callback);
            }else if (this.contentView) {
                this.renderPopupView(callback);
            } else {
                callback();
            }
        },

        renderContent: function(callback) {
            $(this.contentOptions.el).html(this.content);
            callback();
        },

        moveContentElement: function(callback) {
            this.contentElementPlaceholder = $('<div/>');
            this.contentElement.after(this.contentElementPlaceholder);
            $(this.contentOptions.el).append(this.contentElement);

            callback();
        },

        renderSelectorContent: function(callback) {
            var content = $(this.contentSelector).html();
            $(this.contentOptions.el).html(content);
            callback();
        },

        renderPopupView: function(callback) {
            if (_.isString(this.contentView)) {
                tools.loadModules(this.contentView, _.bind(function(View) {
                    this.contentView = View;
                    this.renderPopupView(callback);
                }, this));
            } else {
                this.subview('contentView', new this.contentView(this.contentOptions));
                callback();
            }
        },

        initPopupEvents: function() {
            this.$popup.on('click', '[data-role="close"]', _.bind(this.close, this));
        },

        close: function() {
            if (!this.$popup) {
                return;
            }

            if (this.contentElement && this.contentElementPlaceholder) {
                this.contentElementPlaceholder.after(this.contentElement);
            }

            this.$popup.remove();

            delete this.$popup;
            this.removeSubview('contentView');
            this.trigger('close');
        },

        /**
         * @inheritDoc
         */
        getTemplateData: function() {
            var data = FullscreenPopupView.__super__.getTemplateData.apply(this, arguments);
            data = _.extend({}, data, this.templateData);
            return data;
        }
    });

    return FullscreenPopupView;
});
