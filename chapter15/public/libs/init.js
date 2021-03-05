/*
* 初始化环境部分
*/

AMBIENT_LIGHT = 0x3498db; //环境光
mats = [];//初始化视频贴图数组


//初始化渲染器
function initRender() {
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

//初始化相机
function initCamera() {
    camera = new THREE.PerspectiveCamera(45, 1.5, 0.1, 1000);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

//初始化正交相机
function initOrthCamera() {
    camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 100);
    camera.position.set(0,0,100);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

//初始化场景
function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff)//THREE.Color(0x3a0d14);
}

//初始化灯光
function initLight(color) {
  //添加环境光
  var ambientLight=new THREE.AmbientLight("#999999");
  scene.add(ambientLight);
  //添加点光源
  var pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.set(20, 60, 30);
  pointLight.distance = 90;
  pointLight.intensity = 5;
  scene.add(pointLight);
}

//重复渲染
function render() {
    controls.update();
    renderer.render( scene, camera );
    requestAnimationFrame( render );
}

function initControls() {
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    // 如果使用animate方法时，将此函数删除
    //controls.addEventListener( 'change', render );
    // 使动画循环使用时阻尼或自转 意思是否有惯性
    controls.enableDamping = true;
    //动态阻尼系数 就是鼠标拖拽旋转灵敏度
    //controls.dampingFactor = 0.25;
    //是否可以缩放
    controls.enableZoom = true;
    //是否自动旋转
    controls.autoRotate = false;
    //设置相机距离原点的最远距离
    controls.minDistance  = 50;
    //设置相机距离原点的最远距离
    controls.maxDistance  = 2000;
    //是否开启右键拖拽
    controls.enablePan = true;
}
