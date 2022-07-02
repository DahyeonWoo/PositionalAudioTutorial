# Computer Graphics 기말과제 - PositionalAudio

(MIT) 2022 Dahyeon Woo

## 아이템 선정 - PositionalAudio

### 목표

- PostionalAudio를 이해한다.
- PostionalAudio를 활용한 코드를 실행해서 Positional Audio가 어떤 효과를 가지는지 직접 체험한다.

### 주의사항

```bash
Access to script at 'file:///C:/경로/js/module.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, https.
```

html 코드를 그대로 화면에 띄운다면, 위와 같은 오류가 발생하면서 오디오가 실행이 되지 않는다.

그 이유는 SOP (Same Origin Policy - 동일 출처 정책)에서 찾을 수 있다. SOP는 어떤 출처(origin)에서 불러온 문서나 스크립트가 다른 출처에서 가져온 리소스와 상호작용하는 것을 제한하는 브라우저의 보안 방식이다.  프로토콜, 호스트, 포트를 같게 만들면 같은 출처로 인식하게 된다.

실행 파일에서는 로컬시스템에서 로컬 파일 리소스를 요청할 때 origin(출처)이 null로 넘어가기 때문에 CORS에러가 발생했다. 서버에 올려 프로토콜, 호스트, 포트를 같게 만들면 오류가 해결된다. 

간단하게 서버에 올리는 방법은 아래와 같다.

```
npm install http-server -g
```

http-server가 없다면 위 명령어로 전역으로 설치한다.

```
npx http-server
```

위 명령어로 http-server를 실행시켜 해당 폴더를 서버에 올린다.

```
http://127.0.0.1:8080
```

위 URL로 접속해서 에러가 사라진 것을 확인한다.

(+)

```
npx http-server -p 원하는 포트번호
```

만약 다른 포트로 실행하고 싶다면 위 명령어로 서버를 실행해 해당 포트로 접속하면 된다.

### 구현 결과

### 1. Index 페이지

- 프로젝트의 주제 그리고 제작자의 학번과 이름을 화면에 띄운다.
![Index](/img/1.png)

### 2. PositionalAudio 설명 페이지

- Audio와 Positional Audio의 차이에 대해 설명한다.
- Three.js에서 Audio를 사용하는 방법에 대해 설명한다.
- PostionalAudio에 대해 자세히 설명한다.
![PositionalAudioIntro](/img/2.png)

### 3. PositionalAudio 페이지

- PositionalAudio를 직접 느껴볼 수 있다. 물체와 가까워짐에 따라 소리가 커지고, 물체에서 멀어지면 소리가 작아진다. 또한 물체의 위치에 따라 좌우 스피커의 음량도 달라진다.
![PositionalAudio](/img/3.png)
![PositionalAudio](/img/4.png)

---

## 개발 과정

```jsx
document.body.style.margin = "0px";
document.body.style.overflow = "hidden";

const h_scr = window.innerWidth;
const v_scr = window.innerHeight; 

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, h_scr / v_scr, 0.1, 100);
camera.position.y = 2;

var light = new THREE.PointLight( );
light.position.set( 50, 50, 50 );
scene.add( light );

var renderer = new THREE.WebGLRenderer();
renderer.setSize(h_scr, v_scr);
document.body.appendChild(renderer.domElement);

```

기본적인 document, renderer ,camera, light, renderer 세팅을 해준다. 

```jsx
var box = new THREE.Mesh( 
  new THREE.BoxBufferGeometry( 1, 1, 1 ),
  new THREE.MeshLambertMaterial( {
    color: 0xff7f00
  } )
);
box.position.z = 4;
scene.add(box);

scene.background = new THREE.CubeTextureLoader()
.setPath( './skybox/' )
.load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );
```

박스와 배경화면을 삽입한다.

```jsx
var listener = new THREE.AudioListener();
camera.add( listener );

var sound = new THREE.PositionalAudio( listener );
```

AudioListener, PositionalAudio 세팅을 해준다.

```jsx
var loader = new THREE.AudioLoader();
loader.load('./sounds/my_song.mp3',
  function( buffer ) { 
    sound.setBuffer( buffer ); 
    sound.setLoop( true ); 
    box.add(sound);
    document.getElementById("playbutton").innerText = "Click To Play Music";
    document.getElementById("playbutton").addEventListener("click", soundon, false);
  },
  function(per){
    document.getElementById("loadPer").innerText = ((per.loaded/4700000)*100).toFixed(1);
  }
);

function soundon(){
  sound.play();
  document.getElementById("playbutton").innerHTML = "playing";
  document.getElementById("playbutton").removeEventListener("click", soundon, false);
  document.getElementById("playbutton").style.backgroundColor = "rgba(255,255,255,0)";
}

```

음원을 불러오고, 버튼을 클릭하면 재생할 수 있도록 설정한다.

```jsx
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  camera.aspect = h_scr / v_scr;
  camera.updateProjectionMatrix();
  renderer.setSize(h_scr, v_scr);
}

function animate() {
  requestAnimationFrame(animate);

  var speed = Date.now() * 0.00025;
  camera.position.x = Math.cos(speed) * 5;
  camera.position.z = Math.sin(speed) * 5;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}

animate();
```

애니메이션을 시작한다.

---

## 느낀점

원래부터 Web에서의 Audio 표현에 관심이 있었기 때문에 주제를 쉽게 선정한 편이었다. 

그러나 다른 주제에 비해 오픈소스 코드가 적었고, 직접 구현하는 것 또한 시행착오가 많았다.

특히나, CORS 오류가 코드의 오류인 것으로 착각하고 시간 낭비를 했던 것이 아쉬운 점으로 남는다. 이때, 오류 메시지를 잘 확인해야하면서 개발하는 것의 중요성을 느꼈다.

시행착오를 겪으면서 개발했기 때문에, 앞으로 Three.js의 Audio 기능을 더욱 능숙하게 사용할 수 있으리라고 기대된다. 

다른 사람들이 PositionalAudio Tutorial  페이지를 보고 Audio에 대해 이해하고 관심을 가지는 계기가 되었으면 한다.

---

## 참고

- CORS 오류 해결 방법은 다음의 블로그 글을 참고했다. ( [https://velog.io/@takeknowledge/로컬에서-CORS-policy-관련-에러가-발생하는-이유-3gk4gyhreu](https://velog.io/@takeknowledge/%EB%A1%9C%EC%BB%AC%EC%97%90%EC%84%9C-CORS-policy-%EA%B4%80%EB%A0%A8-%EC%97%90%EB%9F%AC%EA%B0%80-%EB%B0%9C%EC%83%9D%ED%95%98%EB%8A%94-%EC%9D%B4%EC%9C%A0-3gk4gyhreu) )
- Three.js 공식 문서를 참고했다. ( [https://threejs.org/docs/?q=Audio#api/en/audio/Audio](https://threejs.org/docs/?q=Audio#api/en/audio/Audio) )
- Cube Texture 배경 사진은 다음의 블로그를 참고했다. ([https://eztutorblog.wordpress.com/2016/10/26/three-js-9-skycube/](https://eztutorblog.wordpress.com/2016/10/26/three-js-9-skycube/))
- Sound는 Three.js Example의 Sound를 이용했다. ([https://github.com/mrdoob/three.js/blob/master/examples/sounds/358232_j_s_song.mp3](https://github.com/mrdoob/three.js/blob/master/examples/sounds/358232_j_s_song.mp3))
- 아주대학교 이환용 교수님이 제공해 주신 코드를 참고했다.
- MIT 라이센스를 첨부하였다.
