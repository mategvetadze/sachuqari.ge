document.addEventListener('DOMContentLoaded', function() {

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

  console.log('Creating snowflakes...');
for (let i = 0; i < 20; i++) {
  setTimeout(() => createSnowflake(), i * 100);
}
setInterval(() => {
  for (let i = 0; i < 3; i++) { 
    createSnowflake();
  }
}, 200); 

  
  document.getElementById('orderFormOverlay').addEventListener('click', function(e){
    if (e.target === this){
      closeOrderForm();
    }
  });

  document.getElementById('deliveryOverlay').addEventListener('click', function(e){
    if (e.target === this){
      closeDelivery();
    }
  });

  document.getElementById('paymentOverlay').addEventListener('click', function(e){
    if (e.target === this){
      closePayment();
    }
  });

}); 

function openOrderForm(){
  document.getElementById('orderFormOverlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeOrderForm(){
  document.getElementById('orderFormOverlay').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function submitOrder(event){
  event.preventDefault();

  const numPeople = parseInt(document.getElementById('numPeople').value);
  const videoType = document.querySelector('input[name="videoType"]:checked').value;
  const videoTypeText = videoType === 'video-film' ? 'ვიდეო ფილმი (150 ლარი)' : 'მიმართვა კაბინეტიდან (100 ლარი)';

  const people = [];
  for (let i = 1; i <= numPeople; i++) {
    people.push({
      name: document.getElementById(`childName${i}`).value,
      age: document.getElementById(`childAge${i}`).value,
      message: document.getElementById(`message${i}`).value,
      photo: document.getElementById(`photoUpload${i}`).files
    });
  }

  const formData = {
    numPeople: numPeople,
    people: people,
    videoType: videoTypeText
  };
  
  console.log('Order submitted:', formData);
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

function submitDelivery(event){
  event.preventDefault();
  
  const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;
  const deliveryData = {
    method: deliveryMethod
  };
  
  if (deliveryMethod === 'gmail') {
    deliveryData.email = document.getElementById('gmailAddress').value;
  } else if (deliveryMethod === 'other') {
    deliveryData.otherMethod = document.getElementById('otherMethod').value;
  }
  
  console.log('Delivery method:', deliveryData);
  closeDelivery();
  document.getElementById('paymentOverlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeDelivery(){
  document.getElementById('deliveryOverlay').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function backToOrder(){
  document.getElementById('deliveryOverlay').style.display = 'none';
  document.getElementById('orderFormOverlay').style.display = 'flex';
}

function closePayment(){
  document.getElementById('paymentOverlay').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function submitPayment(event){
  event.preventDefault();
  
  const paymentData = {
    fullName: document.getElementById('fullName').value,
    numberPhone: document.getElementById('numberPhone').value,
    cardNum: document.getElementById('cardNum').value,
    expMonth: document.getElementById('expMonth').value,
    expYear: document.getElementById('expYear').value,
    cvv: document.getElementById('cvv').value
  };
  
  console.log('Payment submitted:', paymentData);
  document.getElementById('paymentForm').reset();
  document.getElementById('orderForm').reset();
  document.getElementById('deliveryForm').reset();
  closePayment();
  document.getElementById('successModal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function saveForm(){
  document.getElementById('paymentOverlay').style.display = 'none';
  document.getElementById('deliveryOverlay').style.display = 'flex';
}

function closeSuccessModal(){
  document.getElementById('successModal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function updateNameFields() {
  const numPeople = parseInt(document.getElementById('numPeople').value);
  const container = document.getElementById('nameFieldsContainer');
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

    const fileInput = photoGroup.querySelector(`#photoUpload${i}`);
    let selectedFiles = [];

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
        reader.onload = function(e) {
          const previewDiv = document.createElement('div');
          previewDiv.className = 'image-preview';
          
          const img = document.createElement('img');
          img.src = e.target.result;
          
          const removeBtn = document.createElement('button');
          removeBtn.className = 'remove-image';
          removeBtn.innerHTML = '×';
          removeBtn.type = 'button';
          removeBtn.onclick = function() {
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


