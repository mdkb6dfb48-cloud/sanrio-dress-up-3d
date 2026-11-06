import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

// KHỞI TẠO GAME
const container = document.getElementById("game3d");

const scene = new THREE.Scene();
scene.background = new THREE.Color("#f8d9ed");

const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.1,
  100
);

camera.position.set(0, 1.8, 6);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  preserveDrawingBuffer: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

// ÁNH SÁNG
scene.add(new THREE.HemisphereLight(0xffffff, 0xd8a0cf, 2));

const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(3, 5, 5);
scene.add(light);

// SÀN
const floor = new THREE.Mesh(
  new THREE.CircleGeometry(5, 64),
  new THREE.MeshStandardMaterial({color: "#fceafa"})
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.05;
scene.add(floor);

// NHÓM NHÂN VẬT
let character = new THREE.Group();
scene.add(character);

let outfitColor = "#ff8fc9";
let characterType = 0;
let accessoryType = 0;

const outfits = ["#ff8fc9", "#a98bfa", "#83c9f5", "#ffffff"];

function sphere(parent, x, y, z, sx, sy, sz, color) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 24),
    new THREE.MeshStandardMaterial({color})
  );
  mesh.position.set(x, y, z);
  mesh.scale.set(sx, sy, sz);
  parent.add(mesh);
  return mesh;
}

function buildCharacter() {
  character.clear();

  const fur = ["#fff0f7", "#fff4ec", "#f4eaff"][characterType];
  const dark = "#67465d";

  // ĐẦU
  sphere(character, 0, 1.85, 0, 0.72, 0.69, 0.58, fur);

  // TAI
  if (characterType === 0) {
    sphere(character, -0.43, 2.55, 0, 0.17, 0.65, 0.15, fur);
    sphere(character, 0.43, 2.55, 0, 0.17, 0.65, 0.15, fur);
    sphere(character, -0.43, 2.55, 0.13, 0.09, 0.48, 0.04, "#ffb4d9");
    sphere(character, 0.43, 2.55, 0.13, 0.09, 0.48, 0.04, "#ffb4d9");
  } else {
    const earGeometry = new THREE.ConeGeometry(0.24, 0.7, 4);
    for (const x of [-0.43, 0.43]) {
      const ear = new THREE.Mesh(
        earGeometry,
        new THREE.MeshStandardMaterial({color: fur})
      );
      ear.position.set(x, 2.45, 0);
      ear.rotation.z = x < 0 ? 0.15 : -0.15;
      character.add(ear);
    }
  }

  // MẮT
  sphere(character, -0.25, 1.93, 0.51, 0.055, 0.09, 0.035, dark);
  sphere(character, 0.25, 1.93, 0.51, 0.055, 0.09, 0.035, dark);

  // MÁ HỒNG
  sphere(character, -0.42, 1.76, 0.48, 0.12, 0.055, 0.025, "#ffabc9");
  sphere(character, 0.42, 1.76, 0.48, 0.12, 0.055, 0.025, "#ffabc9");

  // MIỆNG
  sphere(character, 0, 1.73, 0.53, 0.045, 0.035, 0.025, "#bd718d");

  // CỔ
  sphere(character, 0, 1.13, 0, 0.18, 0.2, 0.18, fur);

  // THÂN VÀ ÁO
  sphere(character, 0, 0.88, 0, 0.43, 0.55, 0.31, outfitColor);

  // VÁY
  const skirt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.68, 0.55, 32),
    new THREE.MeshStandardMaterial({
      color: outfitColor,
      roughness: 0.6
    })
  );
  skirt.position.y = 0.43;
  character.add(skirt);

  // TAY
  sphere(character, -0.51, 0.92, 0, 0.16, 0.42, 0.16, fur);
  sphere(character, 0.51, 0.92, 0, 0.16, 0.42, 0.16, fur);

  // CHÂN
  sphere(character, -0.23, -0.05, 0, 0.15, 0.38, 0.16, fur);
  sphere(character, 0.23, -0.05, 0, 0.15, 0.38, 0.16, fur);

  // GIÀY
  sphere(character, -0.23, -0.35, 0.1, 0.19, 0.12, 0.25, "#ed86bb");
  sphere(character, 0.23, -0.35, 0.1, 0.19, 0.12, 0.25, "#ed86bb");

  // PHỤ KIỆN
  addAccessory();

  character.position.y = 0.38;
}

function addAccessory() {
  if (accessoryType === 3) return;

  const color = accessoryType === 0
    ? "#ff5ca8"
    : accessoryType === 1
    ? "#ffcf55"
    : "#ff91bd";

  if (accessoryType === 0) {
    sphere(character, -0.36, 2.48, 0.12, 0.19, 0.12, 0.09, color);
    sphere(character, -0.16, 2.48, 0.12, 0.19, 0.12, 0.09, color);
    sphere(character, -0.26, 2.48, 0.2, 0.07, 0.07, 0.06, "#ffdaea");
  }

  if (accessoryType === 1) {
    const crown = new THREE.Mesh(
      new THREE.ConeGeometry(0.28, 0.32, 5),
      new THREE.MeshStandardMaterial({
        color,
        metalness: 0.5,
        roughness: 0.3
      })
    );
    crown.position.set(0, 2.6, 0);
    character.add(crown);
  }

  if (accessoryType === 2) {
    sphere(character, 0, 2.48, 0.15, 0.14, 0.14, 0.1, color);
    for (let i = 0; i < 5; i++) {
      const angle = i * Math.PI * 2 / 5;
      sphere(
        character,
        Math.cos(angle) * 0.13,
        2.48 + Math.sin(angle) * 0.13,
        0.15,
        0.09, 0.09, 0.06,
        "#ffb9d6"
      );
    }
  }
}

// THAY NHÂN VẬT
window.changeCharacter = function(type) {
  characterType = type;
  const names = ["Pink Bunny", "Cream Kitty", "Purple Girl"];
  document.getElementById("characterName").textContent = names[type];
  buildCharacter();
};

// THAY TRANG PHỤC
window.changeOutfit = function(type) {
  outfitColor = outfits[type];
  buildCharacter();
};

// THAY PHỤ KIỆN
window.changeAccessory = function(type) {
  accessoryType = type;
  buildCharacter();
};

// LƯU ẢNH
window.savePicture = function() {
  renderer.render(scene, camera);

  const link = document.createElement("a");
  link.download = "my-fashion-character.png";
  link.href = renderer.domElement.toDataURL("image/png");
  link.click();
};

// XOAY NHÂN VẬT BẰNG TAY
let dragging = false;
let previousX = 0;

renderer.domElement.addEventListener("pointerdown", e => {
  dragging = true;
  previousX = e.clientX;
});

window.addEventListener("pointerup", () => {
  dragging = false;
});

renderer.domElement.addEventListener("pointermove", e => {
  if (!dragging) return;
  const movement = e.clientX - previousX;
  character.rotation.y += movement * 0.01;
  previousX = e.clientX;
});

// KHỞI ĐỘNG
buildCharacter();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

// THÍCH ỨNG MÀN HÌNH
window.addEventListener("resize", () => {
  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});
