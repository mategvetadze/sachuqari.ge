document.addEventListener('DOMContentLoaded', function () {
  function createSnowflake() {
    const snowContainer = document.querySelector('.snow-container');
    if (!snowContainer) {
      console.error('Snow container not found!');
      return;
    }

    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';

    const size = Math.random() * 5 + 3;
    snowflake.style.width = size + 'px';
    snowflake.style.height = size + 'px';
    snowflake.style.left = Math.random() * 100 + '%';

    const duration = Math.random() * 7 + 8;
    snowflake.style.animationDuration = duration + 's';
    snowflake.style.animationDelay = Math.random() * 2 + 's';
    snowflake.style.opacity = Math.random() * 0.5 + 0.4;

    snowContainer.appendChild(snowflake);

    setTimeout(() => {
      snowflake.remove();
    }, (duration + 2) * 1000);
  }

  for (let i = 0; i < 20; i++) {
    setTimeout(() => createSnowflake(), i * 100);
  }
  setInterval(() => {
    for (let i = 0; i < 3; i++) {
      createSnowflake();
    }
  }, 200);

  const orderFormOverlay = document.getElementById('orderFormOverlay');
  if (orderFormOverlay) {
    orderFormOverlay.addEventListener('click', e => {
      if (e.target === orderFormOverlay) {
        closeOrderForm();
      }
    });
  }

  // Handle delivery overlay - FIXED
  const deliveryOverlay = document.getElementById('deliveryOverlay');
  if (deliveryOverlay) {
    deliveryOverlay.addEventListener('click', e => {
      if (e.target === deliveryOverlay) {
        closeDelivery();
      }
    });
  }

  // Handle payment overlay
  const paymentOverlay = document.getElementById('paymentOverlay');
  if (paymentOverlay) {
    paymentOverlay.addEventListener('click', e => {
      if (e.target === paymentOverlay) {
        closePayment();
      }
    });
  }
});

function openOrderForm() {
  document.getElementById('orderFormOverlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeOrderForm() {
  document.getElementById('orderFormOverlay').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function submitOrder(event) {
  event.preventDefault();

  const numPeople = parseInt(document.getElementById('numPeople').value);
  const videoType = document.querySelector('input[name="videoType"]:checked').value;

  let allValid = true;
  for (let i = 1; i <= numPeople; i++) {
    const name = document.getElementById(`childName${i}`).value;
    const age = document.getElementById(`childAge${i}`).value;
    const photos = document.getElementById(`photoUpload${i}`).files;

    if (!name || !age || photos.length < 3) {
      allValid = false;
      break;
    }
  }

  if (!allValid) {
    alert('გთხოვთ შეავსოთ ყველა ველი და ატვირთოთ მინიმუმ 3 ფოტო');
    return;
  }

  console.log('Order submitted');
  closeOrderForm();
  document.getElementById('deliveryOverlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function selectDelivery(method) {
  document.querySelectorAll('.delivery-option').forEach(opt => {
    opt.classList.remove('selected');
  });

  document.getElementById(`option-${method}`).classList.add('selected');

  const gmailField = document.getElementById('gmailField');
  const gmailInput = document.getElementById('gmailAddress');
  const otherField = document.getElementById('otherField');
  const otherInput = document.getElementById('otherMethod');

  if (method === 'gmail') {
    gmailField.classList.add('visible');
    gmailInput.required = true;
    otherField.classList.remove('visible');
    otherInput.required = false;
  } else if (method === 'other') {
    otherField.classList.add('visible');
    otherInput.required = true;
    gmailField.classList.remove('visible');
    gmailInput.required = false;
  } else {
    gmailField.classList.remove('visible');
    gmailInput.required = false;
    otherField.classList.remove('visible');
    otherInput.required = false;
  }
}

function submitDelivery(event) {
  event.preventDefault();

  closeDelivery();
  document.getElementById('paymentOverlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeDelivery() {
  document.getElementById('deliveryOverlay').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function backToOrder() {
  document.getElementById('deliveryOverlay').style.display = 'none';
  document.getElementById('orderFormOverlay').style.display = 'flex';
}

function closePayment() {
  document.getElementById('paymentOverlay').style.display = 'none';
  document.body.style.overflow = 'auto';
}


function saveForm() {
  document.getElementById('paymentOverlay').style.display = 'none';
  document.getElementById('deliveryOverlay').style.display = 'flex';
}
function resetEverything() {
  // 1) Reset standard forms
  ['paymentForm', 'orderForm', 'deliveryForm'].forEach(id => {
    const f = document.getElementById(id);
    if (f) f.reset();
  });

  // 2) Clear dynamic name fields / previews
  const nameContainer = document.getElementById('nameFieldsContainer');
  if (nameContainer) {
    // Remove event listeners by replacing the node (safer)
    const replacement = nameContainer.cloneNode(false);
    nameContainer.parentNode.replaceChild(replacement, nameContainer);
  }

  // 3) Clear any uploadedFiles store if present
  try {
    if (typeof uploadedFiles === 'object' && uploadedFiles !== null) {
      Object.keys(uploadedFiles).forEach(k => delete uploadedFiles[k]);
    }
  } catch (e) {
    // ignore if not defined
  }

  // 4) Reset all file inputs (receipt + all photo inputs)
  const fileInputs = Array.from(document.querySelectorAll('input[type="file"]'));
  fileInputs.forEach(inp => {
    // Replace the input with a fresh clone to remove any attached listeners and clear files
    const fresh = inp.cloneNode(true);
    fresh.value = '';
    // If input had inline attributes (required, id, etc.) they are preserved by cloneNode(true)
    inp.parentNode.replaceChild(fresh, inp);
  });

  // 5) Clear all image preview containers
  document.querySelectorAll('.image-preview-container').forEach(c => c.innerHTML = '');

  // 6) Reset textual "file-name" spans
  document.querySelectorAll('[id^="file-name"]').forEach(span => {
    span.textContent = 'ფაილი არჩეული არ არის';
    span.style.color = '';
  });

  // 7) Hide overlays/modals and reset body overflow
  const overlaySelectors = ['#orderFormOverlay', '#deliveryOverlay', '#paymentOverlay', '#successModal'];
  overlaySelectors.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.style.display = 'none';
  });
  document.body.style.overflow = 'auto';

  // 8) Unselect delivery options / other selected classes
  document.querySelectorAll('.delivery-option.selected').forEach(el => el.classList.remove('selected'));

  // 9) Clear other custom UI bits (gmail/other fields visibility & requirements)
  const gmailField = document.getElementById('gmailField');
  const gmailInput = document.getElementById('gmailAddress');
  const otherField = document.getElementById('otherField');
  const otherInput = document.getElementById('otherMethod');
  if (gmailField) gmailField.classList.remove('visible');
  if (otherField) otherField.classList.remove('visible');
  if (gmailInput) { gmailInput.required = false; gmailInput.value = ''; }
  if (otherInput) { otherInput.required = false; otherInput.value = ''; }

  // 10) Reset radios / checkboxes selections site-wide
  document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
  document.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);

  // 11) Reset any text-based UI elements (upload label, preview images)
  const uploadText = document.getElementById('uploadText');
  if (uploadText) {
    uploadText.textContent = 'აირჩიეთ ფაილი';
    uploadText.style.color = '#666';
  }
  const uploadLabel = document.getElementById('uploadLabel');
  if (uploadLabel) {
    uploadLabel.style.borderColor = '#ddd';
    uploadLabel.style.background = 'white';
  }
  const previewImage = document.getElementById('previewImage');
  if (previewImage) previewImage.src = '';

  // 12) Ensure numPeople control is empty
  const numPeopleInput = document.getElementById('numPeople');
  if (numPeopleInput) numPeopleInput.value = '';

  // 13) Re-enable any disabled submit buttons and restore their label
  document.querySelectorAll('button, input[type="submit"]').forEach(btn => {
    try {
      btn.disabled = false;
      // If the submit button uses .dataset.originalText we restore it, otherwise do nothing
      if (btn.dataset && btn.dataset.originalText) btn.textContent = btn.dataset.originalText;
    } catch (e) { /* ignore */ }
  });

  // 14) Remove any leftover DataTransfer references (browsers don't expose global DataTransfer)
  // nothing to do here, inputs were replaced already.

  // 15) Finally, remove any extra UI classes that might linger
  document.querySelectorAll('.visible').forEach(el => {
    // keep only those that are intended to remain visible? we remove generic visible here
    el.classList.remove('visible');
  });
}
function closeSuccessModal() {
  document.getElementById('successModal').style.display = 'none';
  document.body.style.overflow = 'auto';

  // Additional cleanup when closing success modal
  const container = document.getElementById('nameFieldsContainer');
  container.innerHTML = '';
  document.getElementById('numPeople').value = '';
}
function updateNameFields() {
  const numPeople = parseInt(document.getElementById('numPeople').value);
  const container = document.getElementById('nameFieldsContainer');

  // IMPORTANT: Clear everything first to prevent old data from lingering
  container.innerHTML = '';

  if (!numPeople) return;

  for (let i = 1; i <= numPeople; i++) {
    const fieldGroup = document.createElement('div');
    fieldGroup.style.marginBottom = '20px';

    if (numPeople > 1) {
      const heading = document.createElement('h1');
      const akaa =
        i === 1
          ? "პირველი ადრესატი"
          : i === 2
            ? "მეორე ადრესატი"
            : i === 3
              ? "მესამე ადრესატი"
              : `მე-${i} ადრესატი`;

      heading.textContent = akaa;
      fieldGroup.appendChild(heading);
    }

    const nameGroup = document.createElement('div');
    nameGroup.className = 'form-group';
    nameGroup.innerHTML = `
      <label for="childName${i}">ადრესატის სახელი და გვარი</label>
      <input type="text" id="childName${i}" required>
    `;
    fieldGroup.appendChild(nameGroup);

    const ageGroup = document.createElement('div');
    ageGroup.className = 'form-group';
    ageGroup.style.marginBottom = '0';
    ageGroup.innerHTML = `
      <label for="childAge${i}">ადრესატის ასაკი</label>
      <input type="number" id="childAge${i}" min="0" max="100" required>
    `;
    fieldGroup.appendChild(ageGroup);

    const messageGroup = document.createElement('div');
    messageGroup.className = 'form-group';
    messageGroup.innerHTML = `
      <label for="message${i}">საკითხები, მიზნები, რჩევები და ა.შ თუ რაზე გსურთ ისაუბროს სანტამ</label>
      <textarea id="message${i}" placeholder="მაგ: რა უყვარს ყველაზე მეტად, რა არის მისი ჰობი..."></textarea>
    `;
    fieldGroup.appendChild(messageGroup);

    const photoGroup = document.createElement('div');
    photoGroup.className = 'form-group';
    photoGroup.style.marginBottom = '0';
    photoGroup.innerHTML = `
      <label for="photoUpload${i}">ატვირთე ფოტო (მინ. 3 ადრესატის, 1-2 თქვენი სურვილისამებრ)</label>
      <div class="custom-file-upload">
        <label for="photoUpload${i}" class="upload-label">აირჩიეთ ფოტოები</label>
        <span id="file-name${i}">ფაილი არჩეული არ არის</span>
        <input type="file" id="photoUpload${i}" accept="image/*" multiple required style="display: none;">
      </div>
      <div class="image-preview-container" id="preview-container${i}"></div>
    `;
    fieldGroup.appendChild(photoGroup);

    // Create fresh selectedFiles array for THIS specific input
    let selectedFiles = [];

    const fileInput = photoGroup.querySelector(`#photoUpload${i}`);

    // *** KEY FIX: Accumulate files and sync with input ***
    fileInput.addEventListener('change', (e) => {
      const newFiles = Array.from(e.target.files);
      // Add new files to existing ones
      selectedFiles = [...selectedFiles, ...newFiles];
      
      // Update the actual file input with all accumulated files
      const dataTransfer = new DataTransfer();
      selectedFiles.forEach(file => dataTransfer.items.add(file));
      fileInput.files = dataTransfer.files;

      updateFileDisplay(i, selectedFiles);
      updatePreview(i, selectedFiles);
    });

    function updateFileDisplay(index, files) {
      const fileNameSpan = document.getElementById(`file-name${index}`);
      const fileInput = document.getElementById(`photoUpload${index}`);

      if (files.length === 0) {
        fileNameSpan.textContent = 'ფაილი არჩეული არ არის';
        fileNameSpan.style.color = '';
        fileInput.setCustomValidity('აირჩიეთ მინიმუმ 3 ფოტო');
      } else if (files.length < 3) {
        fileNameSpan.textContent = `უნდა აირჩიოთ მინიმუმ 3 ფოტო (არჩეულია ${files.length})`;
        fileNameSpan.style.color = '#ff4444';
        fileInput.setCustomValidity('აირჩიეთ მინიმუმ 3 ფოტო');
      } else {
        fileNameSpan.textContent = `${files.length} ფოტო არჩეულია`;
        fileNameSpan.style.color = '#44ff44';
        fileInput.setCustomValidity('');
      }
    }

    function updatePreview(index, files) {
      const previewContainer = document.getElementById(`preview-container${index}`);
      previewContainer.innerHTML = '';

      files.forEach((file, fileIndex) => {
        const reader = new FileReader();
        reader.onload = function (e) {
          const previewDiv = document.createElement('div');
          previewDiv.className = 'image-preview';

          const img = document.createElement('img');
          img.src = e.target.result;

          const removeBtn = document.createElement('button');
          removeBtn.className = 'remove-image';
          removeBtn.innerHTML = '×';
          removeBtn.type = 'button';
          
          // *** KEY FIX: Update file input when removing files ***
          removeBtn.onclick = function () {
            // Remove from selectedFiles array
            selectedFiles.splice(fileIndex, 1);
            
            // Update the actual file input with remaining files
            const dataTransfer = new DataTransfer();
            selectedFiles.forEach(file => dataTransfer.items.add(file));
            const fileInputElement = document.getElementById(`photoUpload${index}`);
            fileInputElement.files = dataTransfer.files;
            
            updateFileDisplay(index, selectedFiles);
            updatePreview(index, selectedFiles);
          };

          previewDiv.appendChild(img);
          previewDiv.appendChild(removeBtn);
          previewContainer.appendChild(previewDiv);
        };
        reader.readAsDataURL(file);
      });
    }

    container.appendChild(fieldGroup);
  }
}

function copyAccount(inputId) {
  const input = document.getElementById(inputId);
  const button = event.currentTarget;
  const copyText = button.querySelector('.copy-text');
  const originalText = copyText.textContent;

  input.select();
  input.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(input.value).then(() => {
    copyText.textContent = 'დაკოპირდა!';
    button.style.background = 'linear-gradient(135deg, #ff4444 0%, #ff8800 50%, #ffbb00 100%)';
    button.style.color = 'white';
    button.style.borderColor = 'transparent';
    button.style.boxShadow = '0 6px 20px rgba(255, 136, 0, 0.4)';

    setTimeout(() => {
      copyText.textContent = originalText;
      button.style.background = 'white';
      button.style.color = '#333';
      button.style.borderColor = '#e0e0e0';
      button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  const uploadText = document.getElementById('uploadText');
  const filePreview = document.getElementById('filePreview');
  const previewImage = document.getElementById('previewImage');
  const uploadLabel = document.getElementById('uploadLabel');

  if (file) {
    uploadText.textContent = file.name;
    uploadText.style.color = '#ff8800';
    uploadLabel.style.borderColor = '#ff8800';
    uploadLabel.style.background = 'rgba(255, 136, 0, 0.05)';

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewImage.src = e.target.result;
        filePreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      filePreview.style.display = 'none';
    }
  }
}

function deleteFile() {
  const fileInput = document.getElementById('receipt');
  const uploadText = document.getElementById('uploadText');
  const filePreview = document.getElementById('filePreview');
  const previewImage = document.getElementById('previewImage');
  const uploadLabel = document.getElementById('uploadLabel');

  fileInput.value = '';
  uploadText.textContent = 'აირჩიეთ ფაილი';
  uploadText.style.color = '#666';
  uploadLabel.style.borderColor = '#ddd';
  uploadLabel.style.background = 'white';
  previewImage.src = '';
  filePreview.style.display = 'none';
}







// /*send inforamatiionsssssssssssss */
async function submitPayment(event) {
  event.preventDefault();

  // protect if not a form event
  const formEl = event && event.target ? event.target : document.getElementById('paymentForm');

  const receiptInput = document.getElementById('receipt');
  const receipt = receiptInput?.files?.[0];
  if (!receipt) {
    alert('გთხოვთ ატვირთოთ ქვითარი');
    return;
  }

  // disable submit button & keep original text
  const submitBtn = formEl.querySelector('.submit-btn') || formEl.querySelector('button[type="submit"]');
  let originalText = '';
  if (submitBtn) {
    originalText = submitBtn.textContent || '';
    // store original text in dataset so clones can restore later
    try { submitBtn.dataset.originalText = originalText; } catch (e) {}
    submitBtn.textContent = 'იგზავნება...';
    submitBtn.disabled = true;
  }

  // Build FormData from current DOM state (note: file inputs will be fresh clones if user triggered resetEverything earlier)
  const formData = new FormData();
  const numPeople = parseInt(document.getElementById('numPeople')?.value) || 0;
  const videoType = document.querySelector('input[name="videoType"]:checked')?.value || '';
  const videoTypeOther = document.getElementById('videoTypeOther')?.value || '';

  formData.append('numPeople', numPeople);
  formData.append('videoType', videoType);
  if (videoTypeOther) formData.append('videoTypeOther', videoTypeOther);

  // gather people data and photos
  const peopleData = [];
  for (let i = 1; i <= numPeople; i++) {
    const name = document.getElementById(`childName${i}`)?.value || '';
    const age = document.getElementById(`childAge${i}`)?.value || '';
    const message = document.getElementById(`message${i}`)?.value || '';
    peopleData.push({ name, age, message });

    // attach files from the current file input (which we've replaced/cloned when resetting)
    const photoInput = document.getElementById(`photoUpload${i}`);
    const photos = photoInput?.files || [];
    for (let j = 0; j < photos.length; j++) {
      formData.append(`person${i}_photo${j}`, photos[j]);
    }
  }
  formData.append('peopleData', JSON.stringify(peopleData));

  // delivery/payment fields
  const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked')?.value || '';
  const gmailAddress = document.getElementById('gmailAddress')?.value || '';
  const otherMethod = document.getElementById('otherMethod')?.value || '';
  formData.append('deliveryMethod', deliveryMethod);
  if (gmailAddress) formData.append('gmailAddress', gmailAddress);
  if (otherMethod) formData.append('otherMethod', otherMethod);

  formData.append('payment_name', document.getElementById('fullName')?.value || '');
  formData.append('payment_contact', document.getElementById('numberPhone')?.value || '');
  formData.append('iban', document.getElementById('iban')?.value || '');
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || '';
  if (paymentMethod) formData.append('payment_method', paymentMethod);

  formData.append('receipt', receipt);

  try {
    // send to server
    const response = await fetch('/', { method: 'POST', body: formData });
    if (!response.ok) throw new Error('Network response was not ok');

    // try to parse json, but don't require it
    let result = null;
    try { result = await response.json(); } catch (e) { /* ignore non-json */ }
    console.log('Order submitted:', result);

    // FULL CLEANUP
    resetEverything();

    // Show success modal explicitly (it might have been removed by resetEverything so recreate/show)
    const successModal = document.getElementById('successModal');
    if (successModal) {
      successModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    } else {
      // optionally create a minimal transient success notice if modal doesn't exist
      const tmp = document.createElement('div');
      tmp.id = 'tmp-success';
      tmp.style.position = 'fixed';
      tmp.style.left = '50%';
      tmp.style.top = '20%';
      tmp.style.transform = 'translateX(-50%)';
      tmp.style.background = '#fff';
      tmp.style.padding = '16px 24px';
      tmp.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
      tmp.style.zIndex = 9999;
      tmp.textContent = 'შეკვეთა წარმატებით გაიგზავნა';
      document.body.appendChild(tmp);
      setTimeout(() => tmp.remove(), 2500);
    }

    // After short time, hide success and fully restore page to interactive state
    setTimeout(() => {
      const success = document.getElementById('successModal');
      if (success) success.style.display = 'none';
      document.body.style.overflow = 'auto';
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalText; }
    }, 6000);

  } catch (err) {
    console.error('Error submitting order:', err);
    alert('შეცდომა შეკვეთის გაგზავნისას');

    // on error re-enable the submit button so user can retry
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }
}
