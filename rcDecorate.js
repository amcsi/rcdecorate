(function () {
    var idCounter = 1000;

    /**
     *  
     * This plugin affects radios and checkboxes such that they are hidden, and labels appear next to them pointing
     * to its hidden radio/checkbox counterpart. This label can be decorated in css any way you want.
     *
     * @todo Document more
     */
    $.fn.rcDecorate = function() {
        var inputs = this.filter('input');
        var rcs = $(inputs.filter('[type=radio], [type=checkbox]'));
        var rcsNotDecorated = rcs.not('.rcDecorated');
        if (!rcsNotDecorated.length) {
            if (rcs.length) {
                return rcs.eq(0).data('rcDecorate');
            }
        }
        rcsNotDecorated.each(function () {
            var el = $(this);
            var isRadio = el.is(':radio');
            var id;
            id = el.prop('id');
            var className = isRadio ? 'radio1' : 'checkbox1';
            if (!id) {
                var idNumber = idCounter++;
                id = className + '-' + idNumber;
                el.prop('id', id);
            }
            var controls = {};

            var inputContainer = el.closest('.radioInputContainer');
            var altLabel = $();
            if (inputContainer.length) {
                altLabel = inputContainer.find('label');
                altLabel.attr('for', id);
            }
            controls.altLabel = altLabel;
            
            var labelId = 'label-' + id;
            var radioImg = $('<label />');
            radioImg.attr('for', id);
            radioImg.prop('id', labelId);
            radioImg.addClass(className);
            if (el.prop('checked')) {
                radioImg.addClass('checked');
                altLabel.addClass('checked');
            }
            radioImg.insertBefore(el);
            
            el.change(function (evt) {
                toCheck = el.prop('checked');
                if (toCheck) {
                    radioImg.addClass('checked');
                    altLabel.addClass('checked');
                }
                else {
                    radioImg.removeClass('checked');
                    altLabel.removeClass('checked');
                }
                var name = el.attr('name');
                /**
                 * If the element is a radio, then uncheck the other radios visually
                 **/
                if (isRadio) {
                    var otherEls = $('input[name="'+name+'"]').not(el);
                    otherEls.each(function (evt) {
                        var otherEl = $(this);
                        var id = $(this).prop('id');
                        var labelId = 'label-' + id;
                        var labelSelector = '#' + labelId;
                        var label = $(document.getElementById(labelId));
                        if (!label.length) {
                            throw "Label with selector of `" + labelSelector + "` not found!";
                        }
                        var altLabel = $(this).rcDecorate().altLabel;
                        label.removeClass('checked');
                        altLabel.removeClass('checked');
                        controls.label = label;
                    })
                }
            });
            el.addClass('rcDecorated');
            el.hide();

            /**
             * Every label that points to the radio should add an "over" class to the
             * substitute label.
             **/
            var labels = $('label[for="'+id+'"]');
            labels.hover(function () {
                radioImg.addClass('over');
            }, function () {
                radioImg.removeClass('over');
            });
            var checkAction = function () {
                if (!el.is(':checked')) {
                    el.prop('checked', true);
                    el.change();
                }
                else if (!isRadio) {
                    el.prop('checked', false);
                    el.change();
                }
            };
            controls.check = function () {
                checkAction();
            }
            labels.click(function (evt) {
                var radioId = $(this).attr('for');
                var radio = $('#' + radioId);
                controls.check();
                evt.preventDefault();
            });
            el.data('rcDecorate', controls);
        });
    }
})();

