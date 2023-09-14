// jshint strict: true, esversion: 8

function run() {
  'use strict';

  async function waitForElem(getter) {
    while (getter() == null) {
      await new Promise(resolve => requestAnimationFrame(resolve));
    }
    return getter();
  }

  async function setupElems() {
    let status_mesg = document.createElement('div');
    status_mesg.name = status_mesg.id = 'paste_coords_status_mesg';
    status_mesg.style.display = 'none';

    let fragment = new DocumentFragment();
    fragment.appendChild(pasteButton());
    fragment.appendChild(status_mesg);

    let elem = await waitForElem(() => document.querySelector('#munzee-edit-page div div'));
    // Add the button only if not already there
    if (!document.getElementById('paste_coords')) elem.appendChild(fragment);
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
    btn.style.cssText = 'width: 20em; background-color: #fff; color: #E82A24; font-weight: 700; border: solid #E82A24; padding: 6px 10px; cursor: pointer; margin: 0; display: inline-block';
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
            let input1 = document.querySelector('input[name="latitude"]');
            input1.value = coords[0];
            input1.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));

            let input2 = document.querySelector('input[name="longitude"]');
            input2.value = coords[1];
            input2.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));

            setStatusOk('Fetched coordinates from clipboard');
          }
        } catch (e) {
          setStatusError('Failed to read clipboard: ' + e);
        }
      }
    );

    return btn;
  }

  // Check if we are on a munzee map page.
  let loc = window.location.href;
  if (!/munzee.com\/m\/\w+\/\d+\/admin\/map$/.test(loc)) return;

  setupElems();
}

// Run the paste button inserter the first time and also whenever the URL
// changes. Some links in the new Munzee web interface do not reload the page.
const observeUrlChange = () => {
  let oldHref = null;
  const body = document.querySelector('body');
  const observer = new MutationObserver(mutations => {
    if (oldHref !== document.location.href) {
      oldHref = document.location.href;
      run();
    }
  });
  observer.observe(body, { childList: true, subtree: true });
};

// window.onload = observeUrlChange;
observeUrlChange();

// -- The End --

