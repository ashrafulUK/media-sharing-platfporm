const IUPS = 'https://imageuploadapi1.azurewebsites.net:443/api/uploadMedia/triggers/When_a_HTTP_request_is_received/invoke?api-version=2022-05-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=6YqZC5rXeTLQ9d2xtDNKr9A0QSS0dwbtR9_613xyQgk';
const RAI = 'https://imageuploadapi1.azurewebsites.net:443/api/getallImageFlow/triggers/When_a_HTTP_request_is_received/invoke?api-version=2022-05-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=wPATRrskZTXqzOliozivUdqcTaTXXYY0GF_UbBSjmEI';
const DEL = 'https://imageuploadapi1.azurewebsites.net:443/api/deleteMedia/triggers/When_a_HTTP_request_is_received/invoke?api-version=2022-05-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=gnUxzM1SJvhgNtkdPSC8vi0ycnaSVSzB6EWpx3jx-g4';
const BLOB_ACCOUNT = 'https://mediashareblob123.blob.core.windows.net';

function login() {
  window.location.href = '/.auth/login/github';  // or /microsoft
}

function logout() {
  window.location.href = '/.auth/logout';
}

async function getUser() {
  const res = await fetch('/.auth/me');
  const data = await res.json();
  if (data.clientPrincipal) {
    document.getElementById("userInfo").innerText = "Welcome, " + data.clientPrincipal.userDetails;
  }
}


function submitNewAsset() {
  const file = $('#UpFile')[0].files[0];
  const reader = new FileReader();
  reader.onloadend = function () {
    const base64 = reader.result.split(',')[1];
    const payload = {
      FileName: $('#FileName').val(),
      userID: "user-id-123", // should come from auth token
      userName: "Ashraful",
      mediaType: $('#mediaType').val(),
      File: base64
    };
    $.ajax({
      url: IUPS,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(payload),
      success: function () {
        alert('Upload successful');
        getMedia();
      }
    });
  };
  reader.readAsDataURL(file);
}

function getMedia() {
  $('#ImageList').html('Loading...');
  $.getJSON(RAI, function (data) {
    let output = '';
    data.forEach(item => {
      const url = BLOB_ACCOUNT + item.filePath;
      if (item.mediaType === 'image') {
        output += `<div><img src='${url}' /><br>${item.fileName}</div>`;
      } else if (item.mediaType === 'audio') {
        output += `<div><audio controls src='${url}'></audio><br>${item.fileName}</div>`;
      } else if (item.mediaType === 'video') {
        output += `<div><video controls src='${url}'></video><br>${item.fileName}</div>`;
      }
      output += `<button onclick="deleteMedia('${item.id}')">Delete</button>`;
    });
    $('#ImageList').html(output);
  });
}

function deleteMedia(id) {
  $.ajax({
    url: DEL + '?id=' + id,
    method: 'DELETE',
    success: function () {
      alert('Deleted successfully');
      getMedia();
    }
  });
}

$(document).ready(function () {
  $('#uploadForm').submit(function (e) {
    e.preventDefault();
    submitNewAsset();
  });
  getMedia();
});
