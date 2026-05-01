export const initEnquiryModal = () => {
  const modal = document.getElementById('enquiry-modal');
  if (!modal) return;

  const closeBtns = modal.querySelectorAll('[data-modal-close]');
  const messageInput = modal.querySelector('#modal-form-message');
  const categorySelect = modal.querySelector('#modal-form-category');

  const openModal = (context = {}) => {
    // Pre-fill message based on context
    if (messageInput) {
      if (context.productName) {
        messageInput.value = `I am interested in third-party manufacturing for ${context.productName}. Please provide a quotation and manufacturing timeline for this composition.`;
      } else {
        messageInput.value = '';
      }
    }

    // Pre-fill category if provided
    if (context.category && categorySelect) {
      const options = Array.from(categorySelect.options);
      const optionToSelect = options.find(opt => opt.text.toLowerCase().includes(context.category.toLowerCase()));
      if (optionToSelect) {
        categorySelect.value = optionToSelect.value;
      }
    }

    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden'; // Prevent scroll
  };

  const closeModal = () => {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  // Listen for all trigger clicks (Universal Delegation)
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-enquire-trigger]');
    if (trigger) {
      console.log('Enquiry trigger clicked:', trigger);
      e.preventDefault();
      const context = {
        productName: trigger.getAttribute('data-product-name'),
        category: trigger.getAttribute('data-category')
      };
      openModal(context);
    }
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  // Close on Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeModal();
    }
  });
};
