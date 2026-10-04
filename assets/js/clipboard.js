import Clipboard from 'clipboard';

var pre = document.getElementsByTagName('pre');

for (var i = 0; i < pre.length; ++ i)
{
  var element = pre[i];
  element.insertAdjacentHTML('afterbegin', '<button type="button" class="btn btn-copy" aria-label="Copy code"></button>');
}

var clipboard = new Clipboard('.btn-copy', {

  text: function(trigger) {
    return trigger.parentElement.textContent;
  },

});

clipboard.on('success', function(e) {

    /*
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);
    */

    e.clearSelection();
});

clipboard.on('error', function(e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
});
