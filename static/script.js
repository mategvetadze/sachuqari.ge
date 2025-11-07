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

  document.getElementById('orderFormOverlay').addEventListener('click', function (e) {
    if (e.target === this) {
      closeOrderForm();
    }
  });

  document.getElementById('deliveryOverlay').addEventListener('click', function (e) {
    if (e.target === this) {
      closeDelivery();
    }
  });

  document.getElementById('paymentOverlay').addEventListener('click', function (e) {
    if (e.target === this) {
      closePayment();
    }
  });
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

function submitPayment(event) {
  event.preventDefault();

  const receipt = document.getElementById('receipt').files[0];
  if (!receipt) {
    alert('გთხოვთ ატვირთოთ ქვითარი');
    return;
  }

  console.log('Payment submitted');

  // Reset all forms
  document.getElementById('paymentForm').reset();
  document.getElementById('orderForm').reset();
  document.getElementById('deliveryForm').reset();

  // Clear the payment file upload display
  deleteFile();

  // Clear all dynamic name fields completely
  const container = document.getElementById('nameFieldsContainer');
  container.innerHTML = '';

  // Reset the number of people selector
  document.getElementById('numPeople').value = '';

  closePayment();
  document.getElementById('successModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function saveForm() {
  document.getElementById('paymentOverlay').style.display = 'none';
  document.getElementById('deliveryOverlay').style.display = 'flex';
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
        <label for="photoUpload${i}" class="upload-label">აირჩიე ფაილები</label>
        <span id="file-name${i}">ფაილი არჩეული არ არის</span>
        <input type="file" id="photoUpload${i}" accept="image/*" multiple required style="display: none;">
      </div>
      <div class="image-preview-container" id="preview-container${i}"></div>
    `;
    fieldGroup.appendChild(photoGroup);

    // Create fresh selectedFiles array for THIS specific input
    let selectedFiles = [];

    const fileInput = photoGroup.querySelector(`#photoUpload${i}`);

    fileInput.addEventListener('change', (e) => {
      const newFiles = Array.from(e.target.files);
      selectedFiles = [...selectedFiles, ...newFiles];

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
          removeBtn.onclick = function () {
            // Remove from selectedFiles array
            selectedFiles.splice(fileIndex, 1);
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

  const receipt = document.getElementById('receipt').files[0];
  if (!receipt) {
    alert('rame');
    return;
  }
  const formData = new FormData();

  const numPeople = parseInt(document.getElementById('numPeople').value);
  const videoType = document.querySelector('input[name="videoType"]:checked').value;

  formData.append('numPeople', numPeople);
  formData.append('videoType', videoType);

  const peopleData = [];
  for (let i = 1; i <= numPeople; i++) {
    const personData = {
      name: document.getElementById(`childName${i}`).value,
      age: document.getElementById(`childAge${i}`).value,
      message: document.getElementById(`message${i}`)?.value || ''
    };
    peopleData.push(personData);

    const photos = document.getElementById(`photoUpload${i}`).files;
    for (let j = 0; j < photos.length; j++) {
      formData.append(`person${i}_photo${j}`, photos[j]);
    }
  }

  formData.append('peopleData', JSON.stringify(peopleData));

  const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;
  formData.append('deliveryMethod', deliveryMethod);

  if (deliveryMethod === 'gmail') {
    formData.append('gmailAddress', document.getElementById('gmailAddress').value);
  } else if (deliveryMethod === 'other') {
    formData.append('otherMethod', document.getElementById('otherMethod').value);
  }

  formData.append('fullName', document.getElementById('fullName').value);
  formData.append('phoneNumber', document.getElementById('numberPhone').value);
  formData.append('receipt', receipt);

  try {
    const submitBtn = event.target.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
     submitBtn.textContent = 'დასრულება';
    submitBtn.disabled = true;
    const response = await fetch('/', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    console.log('Order submitted successfully:', result);

    document.getElementById('paymentForm').reset();
    document.getElementById('orderForm').reset();
    document.getElementById('deliveryForm').reset();

    deleteFile();

    const container = document.getElementById('nameFieldsContainer');
    container.innerHTML = '';

    document.getElementById('numPeople').value = '';

    closePayment();
    document.getElementById('successModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';

  } catch (error) {
    console.error('Error submitting order:', error);
    alert('rame');

    const submitBtn = event.target.querySelector('.submit-btn');
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}