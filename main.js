// jshint strict: true, esversion: 8

function init() {
  'use strict';

  function setupElems() {
    let status_mesg = document.createElement('div');
    status_mesg.name = status_mesg.id = 'paste_coords_status_mesg';
    status_mesg.style.display = 'none';

    let fragment = new DocumentFragment();
    fragment.appendChild(pasteButton());
    fragment.appendChild(status_mesg);

    let mainarea = document.getElementsByClassName('munzee-main-area');
    mainarea[0].appendChild(fragment);
  }

  function setStatus(text, isError) {
    let status_mesg = document.getElementById('paste_coords_status_mesg');
    status_mesg.style.display = 'block';
    status_mesg.textContent = text;
    status_mesg.style.color = isError ? 'red' : 'green';
  }
  function setStatusOk(text) { setStatus(text, false); }
  function setStatusError(text) { setStatus(text, true); }

  function pasteButton() {
    let btn = document.createElement('button');
    btn.name = btn.id = 'paste_coords';
    btn.style.cssText = 'background-color: #fff; color: #E82A24; font-weight: 700; border: solid #E82A24; padding: 6px 10px; cursor: pointer; margin: 0; display: block';
    btn.appendChild(document.createTextNode('Paste Coords'));

    btn.addEventListener('mouseenter',
      () => {
        btn.style.color = '#fff';
        btn.style.backgroundColor = '#E82A24';
      }
    );
    btn.addEventListener('mouseleave',
      () => {
        btn.style.color = '#E82A24';
        btn.style.backgroundColor = '#fff';
      }
    );

    btn.addEventListener('click', 
      async (event) => {
        event.preventDefault();
        try {
          let text = await navigator.clipboard.readText();
          setStatusOk('Clipboard: ' + text);

          let coords = text.match(/-?\d+(?:\.\d+)?/g);
          if (coords === null || coords.length < 2) {
            setStatusError('Coordinates not found in clipboard');
          }
          else {
            document.getElementById('latitude').value = coords[0];
            document.getElementById('longitude').value = coords[1];
            setStatusOk('Fetched coordinates from clipboard');
          }
        } catch (e) {
          setStatusError('Failed to read clipboard: ' + e);
        }
      }
    );

    return btn;
  }

  setupElems();
}

init();

// -- The End --
