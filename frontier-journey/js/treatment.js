/* Treatment UI add-on. The core medicine mechanic lives in game.js. */

function openTreatmentMenu() {
  if (!state || state.ended) return;
  if (state.inventory.medicine <= 0) {
    showInfo('No medicine left', 'You have no medicine doses available. Rest may still help the party recover.');
    return;
  }

  const candidates = aliveParty().filter((member) => member.hp < 100 || member.statuses.length > 0);
  if (!candidates.length) {
    showInfo('No treatment needed', 'Everyone is currently healthy. Save the medicine for when it matters.');
    return;
  }

  const choices = candidates.map((member) => ({
    label: `${member.name} — ${healthLabel(member.hp)}${member.statuses.length ? ` — ${member.statuses.map((status) => status.name).join(', ')}` : ''}`,
    onClick: async () => {
      const before = Math.round(member.hp);
      const treated = useMedicine(member);
      if (!treated) return;
      await saveGame();
      renderGame();
      closeModal();
      sound.good?.play();
      showInfo('Treatment given', `${member.name} improved from ${before}% to ${Math.round(member.hp)}% health, and active illness durations were shortened.`);
    },
  }));

  choices.push({ label: 'Cancel', onClick: closeModal });
  showModal('MEDICINE', 'Who should receive treatment?', `You have ${state.inventory.medicine} dose${state.inventory.medicine === 1 ? '' : 's'} remaining.`, choices);
}

const treatmentButton = document.createElement('button');
treatmentButton.className = 'button action-button';
treatmentButton.dataset.action = 'treat';
treatmentButton.textContent = 'Treat';
treatmentButton.addEventListener('click', () => {
  sound.click?.play();
  openTreatmentMenu();
});

document.querySelector('.action-panel')?.appendChild(treatmentButton);
