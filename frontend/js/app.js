const IUPS = 'YOUR_IUPS_ENDPOINT';
const RAI = 'YOUR_RAI_ENDPOINT';
const DEL = 'YOUR_DELETE_ENDPOINT';
const BLOB_ACCOUNT = 'https://YOUR_BLOB_STORAGE_NAME.blob.core.windows.net';

function login() {
  alert("Redirect to Azure Static Web App login (handled automatically).");
}
function logout() {
  alert("Redirect to logout endpoint.");
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
