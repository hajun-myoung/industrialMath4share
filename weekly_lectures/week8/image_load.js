function addImage(url) {
  const request = new XMLHttpRequest();
  request.open('GET', url);
  request.responseType = 'blob';

  request.addEventListener('load', () => {
    if (request.status == 200) {
      const response = request.response;
      const blob = new Blob([response], { type: 'image/png' });
      const img = document.createElement('img');
      img.src = window.URL.createObjectURL(blob);
      img.onload = () => URL.revokeObjectURL(img.src);
      img.classList.add('col-sm-6', 'col-md-4', 'col-lg-3', 'mb-2');
      document.getElementById('images').appendChild(img);
    } else {
      console.log(`${request.status}: ${request.statusText}`);
    }
  });
  request.addEventListener('error', (event) => console.log('Network error'));
  request.send();
}

async function fetchImage(url) {
  const response = await fetch(url);

  if (!response.ok) {
    console.log(`${response.status}: ${response.statusText}`);
    return;
  }

  const blob = await response.blob();
  const img = document.createElement('img');
  img.src = window.URL.createObjectURL(blob);
  img.onload = () => URL.revokeObjectURL(img.src);
  img.classList.add('col-sm-6', 'col-md-4', 'col-lg-3', 'mb-2');
  document.getElementById('images').appendChild(img);
}

// document.addEventListener('DOMContentLoaded', () => {
const images = [
  'https://cdn.pixabay.com/photo/2018/05/01/18/21/eclair-3366430_1280.jpg',
  'https://cdn.pixabay.com/photo/2018/06/22/14/44/creme-brulee-3490886_1280.jpg',
  'https://cdn.pixabay.com/photo/2017/03/31/18/02/strawberry-dessert-2191973_1280.jpg',
  'https://cdn.pixabay.com/photo/2017/10/28/19/06/macarons-2897881_1280.jpg',
];

images.forEach(addImage);
// images.forEach(fetchImage);

// });
