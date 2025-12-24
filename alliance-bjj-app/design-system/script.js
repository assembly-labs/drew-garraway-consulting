/**
 * Alliance BJJ App - Design System Scripts
 */

// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    // Remove active from all tabs and content
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    // Add active to clicked tab and corresponding content
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});
