(function () {
	/**
	 * Use the shift-enter element as the line delimiter when
	 * pasting into a list.
	 * Normally, Enter key behaviour is changed in a list to create
	 * new list items.
	 *
	 * Now, we convert the to act as if the pasted content
	 * was created in the list directly, except using shift-enter instead of enter.
	 * this seems to be the less destructive way that also
	 * prevents you from "poisoning" a list into creating block tags for eternity.
	 */
	CKEDITOR.plugins.add('shiftenterlistpastefilter', {
		init: function (editor) {
			function filterWithShiftEnterMode( editor, data ) {
				var AFTER_CLIPBOARD_HANDLERS_PRIORITY = 9,
					fragment = CKEDITOR.htmlParser.fragment.fromHtml( data ),
					writer = new CKEDITOR.htmlParser.basicWriter(),
					filter = new CKEDITOR.filter( editor );

				if ( editor.activeEnterMode === CKEDITOR.ENTER_P ) {
					filter.disallow( 'p' );
				}
				else if ( editor.activeEnterMode === CKEDITOR.ENTER_DIV ) {
					filter.disallow( 'div' );
				}
				else {
					// short circuit
					return data;
				}

				filter.applyTo( fragment, true, false, editor.activeShiftEnterMode );
				fragment.writeHtml( writer );

				return writer.getHtml();
			}

			editor.on('paste', function(ev) {
				var editor = ev.editor;
				var block = editor.elementPath().block;

				if (block && block.getName() === 'li') {
					ev.data.dataValue = filterWithShiftEnterMode(editor, ev.data.dataValue);
				}

			}, null, null, AFTER_CLIPBOARD_HANDLERS_PRIORITY);
		}
	});

})();
