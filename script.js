const BASE = "backend"; 


const form = document.getElementById("formMahasiswa");
const namaInput = document.getElementById("nama");
const nimInput = document.getElementById("nim");
const editIdInput = document.getElementById("editId");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelEdit");
const msg = document.getElementById("message");
const tbody = document.querySelector("#tabelMahasiswa tbody");


const menuToggle = document.querySelector(".menu-toggle");
const btnClose = document.querySelector(".btn-close");
const sidebar = document.getElementById("sidebar");


nimInput.addEventListener("input", (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, "");
});


menuToggle.addEventListener("click", () => {
  sidebar.classList.add("active");
});
btnClose.addEventListener("click", () => {
  sidebar.classList.remove("active");
});
document.addEventListener("click", (e) => {
  if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
    sidebar.classList.remove("active");
  }
});

// load awal
document.addEventListener("DOMContentLoaded", () => {
  loadData();
});


async function loadData() {
  try {
    const res = await fetch(`${BASE}/read.php`);
    const json = await res.json();

    if (json.success) renderTable(json.data);
    else showMessage("Gagal memuat data", true);

  } catch (err) {
    showMessage("Koneksi gagal: " + err.message, true);
  }
}

function renderTable(data) {
  tbody.innerHTML = "";
  data.forEach((mhs, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${escapeHtml(mhs.nama)}</td>
      <td>${escapeHtml(mhs.nim)}</td>
      <td>
        <button class="btn-primary btn-edit" data-id="${mhs.id}">Edit</button>
        <button class="btn-secondary btn-delete" data-id="${mhs.id}">Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll(".btn-edit")
    .forEach((b) => b.addEventListener("click", onEdit));

  document.querySelectorAll(".btn-delete")
    .forEach((b) => b.addEventListener("click", onDelete));
}


form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = namaInput.value.trim();
  const nim = nimInput.value.trim();
  const id = editIdInput.value;

  if (!nama || !nim) {
    showMessage("Nama dan NIM wajib diisi", true);
    return;
  }

  try {
    let res, j;

   
    if (!id) {
      res = await fetch(`${BASE}/create.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nama: nama,
          nim: nim
        })
      });

      j = await res.json();

      if (j.success) {
        showMessage("Data berhasil ditambahkan");
        form.reset();
        loadData();
      } else {
        showMessage(j.message || "Gagal menambah data", true);
      }
    }

 
    else {
      res = await fetch(`${BASE}/update.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: id,
          nama: nama,
          nim: nim
        })
      });

      j = await res.json();

      if (j.success) {
        showMessage("Data berhasil diperbarui");
        form.reset();
        editIdInput.value = "";
        submitBtn.textContent = "Tambah";
        cancelBtn.style.display = "none";
        loadData();
      } else {
        showMessage(j.message || "Gagal update", true);
      }
    }

  } catch (err) {
    showMessage("Request gagal: " + err.message, true);
  }
});


async function onEdit(e) {
  const id = e.target.dataset.id;

  try {
    const res = await fetch(`${BASE}/read.php`);
    const j = await res.json();

    if (j.success) {
      const item = j.data.find((x) => x.id == id);

      if (item) {
        namaInput.value = item.nama;
        nimInput.value = item.nim;
        editIdInput.value = item.id;

        submitBtn.textContent = "Simpan Perubahan";
        cancelBtn.style.display = "inline-block";

        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  } catch (err) {
    showMessage("Gagal mengambil data untuk edit", true);
  }
}

cancelBtn.addEventListener("click", () => {
  form.reset();
  editIdInput.value = "";
  submitBtn.textContent = "Tambah";
  cancelBtn.style.display = "none";
});


async function onDelete(e) {
  if (!confirm("Yakin ingin menghapus data ini?")) return;

  const id = e.target.dataset.id;

  try {
    const res = await fetch(`${BASE}/delete.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    });

    const j = await res.json();

    if (j.success) {
      showMessage("Data berhasil dihapus");
      loadData();
    } else {
      showMessage(j.message || "Gagal menghapus", true);
    }

  } catch (err) {
    showMessage("Request gagal: " + err.message, true);
  }
}


function showMessage(text, isError = false) {
  msg.textContent = text;
  msg.style.color = isError ? "red" : "green";
  setTimeout(() => {
    msg.textContent = "";
  }, 3000);
}

function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
