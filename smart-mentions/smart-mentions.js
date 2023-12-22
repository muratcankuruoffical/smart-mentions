
if (typeof initializeSmartMention === 'undefined') {
    /**
     * @param {string} textareaSelector - Textarea element selector.
     * @param {Array} members - Array of members for mentions.
     */
    function initializeSmartMention(textareaSelector, members) { 
        if (typeof jQuery === 'undefined') {
            throw new Error("Smart Mentions requires jQuery. Make sure it is included before this script.");
        }

        if (typeof $.fn.modal === 'undefined') {
            throw new Error("Smart Mentions requires Bootstrap. Make sure it is included before this script.");
        }
        
        if (!document.querySelector(textareaSelector)) {
            throw new Error("Textarea not found. Provide a valid textarea selector.");
        }

        if (!members || !Array.isArray(members) || members.length === 0) {
            throw new Error("Invalid 'members' parameter. Provide an array and it should not be empty.");
        }

        var $textarea = $(textareaSelector);
        $textarea.hide();

        var smartMention = $('<div class="form-control smart-mention" contenteditable="true"></div>');
        var mentionList = $('<ul class="mention-list"></ul>');
        
        $textarea.after(smartMention);
        smartMention.html(parseMentions($textarea.val()));
        smartMention.after(mentionList);


        var mentionedMembers = [];
        
        smartMention.on('input', changeEventHandler);
        

        function changeEventHandler() {
            var inputValue = smartMention.text();

            var match = inputValue.match(/@(\w+)$/);

            if (match) {
                var keyword = match[1].toLowerCase();
                var matchingMembers = members.filter(member => member.name.toLowerCase().includes(keyword));

                mentionList.empty();

                matchingMembers.forEach(function(member) {
                    var mentionItem = $('<li>@' + member.name + '</li>');

                    mentionItem.click(function() {
                        var currentText = smartMention.html().replace(/<\/?[^>]+(>|$)/g, "");
                        var mentionTrigger = '@';
                        var mentionText =  member.name;

                        mentionedMembers.push(member);

                        var mentionedText = currentText.replace(/@(\w*)$/, mentionTrigger + mentionText);

                        smartMention.html(mentionedText);

                        mentionedMembers.forEach(function(mentioned) {
                            highlightMention(mentionTrigger, mentioned.name);
                            mentionedText = hashMention(mentionedText, mentioned);
                        });

                        $textarea.val(mentionedText);
                                    
                        mentionList.hide();
                        moveCaretToEndOfMention();
                    });

                    mentionList.append(mentionItem);
                });

                mentionList.show();
            } else {
                mentionList.hide();
            }

            $textarea.val(smartMention.html());
        }

        function parseMentions(text) {
            return text.replace(/\[(.)(.+?)\]\((\w+):(.+?)\)/, '<span class="mention label" style="font-size:90%;"><span class="member-trigger">@</span><span class="member-value">$2</span></span>&nbsp;');
        }
        
        function hashMention(mentionedText, mentioned) {
            return mentionedText.replace(`@${mentioned.name}`, `[@${mentioned.name}](member:${mentioned.id})`);
        }

        function highlightMention(mentionTrigger, mentionText) {
            var currentText = smartMention.html();

            var mentionSpan = '<span class="mention label" style="font-size:90%;"><span class="member-trigger">' + mentionTrigger + '</span><span class="member-value">' + mentionText + '</span></span>&nbsp;';

            var highlightedText = currentText.replace(`${mentionTrigger}${mentionText}`, mentionSpan);
            smartMention.html(highlightedText);
            mentionList.hide();
        }

        function moveCaretToEndOfMention() {
            var mentionContainers = smartMention.find('.mention');

            if (mentionContainers.length > 0) {
                var lastMention = mentionContainers.last()[0];
                var range = document.createRange();
                var sel = window.getSelection();

                range.setStart(lastMention.nextSibling || lastMention.parentNode, 1);
                range.collapse(true);

                sel.removeAllRanges();
                sel.addRange(range);

                smartMention.focus();
            }
        }

        $(document).click(function(event) {
            if (!$(event.target).closest('.smart-mention').length) {
                mentionList.hide();
            }
        });
    }

}
