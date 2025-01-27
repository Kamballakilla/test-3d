import * as dat from 'dat.gui';

export function setupGUI(tasks) {
    const gui = new dat.GUI();

    for (const [label, task] of Object.entries(tasks)) {
        gui.add({ [label]: task }, label).name(label);
    }

    const guiContainer = document.querySelector('.dg');
    guiContainer.addEventListener('click', (event) => {
        event.stopPropagation();
    });
}
