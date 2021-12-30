# [2] JSX

생성일: 2021년 12월 29일 오후 2:14

## 코드 이해하기

---

```jsx
// App.js
import React from 'react';
import logo from './logo.svg';
import './App.css';
```

`impot React from 'react';` 코드는 리액트를 불러와서 사용할 수 있게 해 준다. 리액트 프로젝트를 만들 때 node_modules라는 디렉터리도 함께 생성되는데 이때 react 모듈이 설치된다. 그리고 `import` 구문을 통해 리액트를 불러와서 사용할 수 있다.

모듈을 불러와서 사용하는 것은 원래 브라우저에는 없던 기능이지만 브라우저가 아닌 환경에서 자바스크립트를 실행할 수 있게 해주는 환경인 Node.js에서 지원하는 기능이다. 

이러한 기능을 브라우저에서 사용하기 위해 **번들러**를 사용한다. 대표적인 번들러로 웹팩, Parcel, browserify라는 도구들이 있으며, 리액트는 주로 **웹팩**을 사용하는 추세이다. 번들러 도구를 사용하면 import로 모듈을 불러왔을 때 불러온 모듈을 모두 합쳐서 하나의 파일을 생성해 준다. 또 최적화 과정에서 여러 개의 파일로 분리될 수 있다.

웹팩을 사용하면 SVG 파일과 CSS 파일도 불러와서 사용할 수 있다. 이렇게 파일들을 불러오는 것은 웹팩의 **로더**라는 기능이 담당한다. 

```jsx
// App.js
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
export default App;
```

위 코드는 App이라는 컴포넌트를 만들어 준다. `function` 키워드를 사용하여 컴포넌트를 만든 것을 함수형 컴포넌트라고 부른다. 프로젝트에서 컴포넌트를 렌더링하면 함수에서 반환하고 있는 내용을 나타낸다. 함수에서 반환하는 내용을 보면 HTML을 닮았지만 이것을 **JSX**라고 부른다.

## JSX

---

JSX는 자바스크립트의 확장 문법이며 XML과 매우 비슷하게 생겼다. 이런 형식으로 작성한 코드는 브라우저에서 실행되기 전에 코드가 번들링되는 과정에서 바벨을 사용하여 일반 자바스크립트 형태의 코드로 변환된다. 

```jsx
function App() {
	return (<div>Hello <b>react</b></div>);
}
```

위 코드와 같이 작성된 코드를 다음과 같이 변환된다.

```jsx
function App() {
	return React.createElement("div", null, "Hello ", 
				 React.createElement("b", null, "react"));
}
```

JSX를 사용하면 매번 `React.createElement`를 사용하지 않고 편하게 UI를 렌더링할 수 있다.

HTML 태그 뿐만아니라 App 컴포넌트와 같이 앞으로 만들 컴포넌트도 JSX 안에서 작성할 수 있다.

```jsx
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />     // App 컴포넌트를 마치 HTML 태그 쓰듯이 그냥 작성한다.
  </React.StrictMode>,
  document.getElementById('root')
);
```

`ReactDOM.render` 코드는 컴포넌트를 페이지에 렌더링하는 역할을 하며, react-dom 모듈을 불러와 사용할 수 있다. 이 함수의 첫 번째 파라미터에는 페이지에 렌더링할 내용을 JSX 형태로 작성하고, 두 번째 파라미터에는 해당 JSX를 렌더링할 document 내부 요소를 설정한다. 이 요소는 `public/index.html` 파일에 있다.

`React.StrictMode`는 리액트의 레거시 기능들을 사용하지 못하게 하는 기능이다.

## JSX 문법

---

### 감싸인 요소

컴포넌트에 여러 요소가 있다면 반드시 부모 요소 하나로 감싸야 한다.

```jsx
function App() {
  return (
    <h1>리액트 안녕!</h1>
    <h2>잘 작동하니?</h2>
  );
}
```

위 코드는 오류가 발생한다.

```jsx
function App() {
  return (
		<div>
	    <h1>리액트 안녕!</h1>
	    <h2>잘 작동하니?</h2>
		</div>
  );
}
```

Virtual DOM에서 컴포넌트 변화를 감지해 낼 때 효율적으로 비교할 수 있도록 컴포넌트 내부는 하나의 DOM 트리 구조로 이루어져야 한다는 규칙이 있기 때문이다.

꼭 div 요소를 사용하지 않아도 된다.

```jsx
import React, { Fragment } from 'react';
function App() {
  return (
		<Fragment>
	    <h1>리액트 안녕!</h1>
	    <h2>잘 작동하니?</h2>
		</Fragment>
  );
}
```

```jsx
function App() {
  return (
		<>
	    <h1>리액트 안녕!</h1>
	    <h2>잘 작동하니?</h2>
		</>
  );
}

```

### 자바스크립트 표현

JSX 안에서는 자바스크립트 표현식을 쓸 수 있다. 자바스크립트 표현식을 작성하려면 JSX 내부에서 코드를 `{}`로 감싸면 된다.

```jsx
function App() {
	const name = '리액트';
  return (
		<>
	    <h1>{name} 안녕!</h1>
	    <h2>잘 작동하니?</h2>
		</>
  );
}
```

### If문 대신 조건부 연산자

JSX 내부의 자바스크립트 포현식에서 if문을 사용할 수 없다. 하지만 조건에 따라 다른 내용을 렌더링해야 할 때는 JSX 밖에서 if문을 사용하여 사전에 값을 설정하거나, `{}`안에 조건부 연산자를 사용하면 된다.

```jsx
function App() {
  const name = '리액트';
  return (
    <>
      {name === '리액트' ? (
        <h1>리액트입니다.</h1>
      ) : (
        <h1>리액트가 아닙니다.</h1>
      )}
    </>
  );
}
```

### AND 연산자(&&)를 사용한 조건부 렌더링

특정 조건을 만족할 때 내용을 보여 주고, 만족하지 않을 때 아무것도 렌더링 하지 않아야 하는 상황이 올 수 있다. 이럴 때도 조건부 연산자를 통해 구현할 수 있다.

```jsx
function App() {
  const name = '리액트';
  return (<>{name === '리액트' && <h1>리액트입니다.</h1>}</>);
}
```

예외적으로 숫자 0은 화면에 나타난다.

### undefined를 렌더링하지 않기

리액트 컴포넌트에서는 함수에서 `undefined`만 반환하여 렌더링하는 상황을 만들면 안된다. 어떤 값이 `undefined`일 수도 있다면, OR 연산자를 사용하면 기본값을 지정하여 오류를 방지할 수 있다.

```jsx
function App() {
	const name = undefined;
	return name || '값이 undefined입니다.';
}
```

반면, JSX 내부에서 `undefined`를 렌더링하는 것은 괜찮다. 

```jsx
function App() {
	const name = undefined;
	return <>{name || '값이 undefined입니다.'}</>;
}
```

### 인라인 스타일링

리액트에서 DOM 요소에 스타일을 적용할 때는 문자열 형태로 넣는 것이 아니라 객체 형태로 넣어 주어야 한다. 스타일 이름은 **카멜 표기법**으로 작성해야 한다.

```jsx
function App() {
	const name = '리액트';
	const style = {
		backgroundColor: 'black',
		color: 'aqua';
		fontSize: '48px';
		fontWeight: 'bold';
		padding: 16  // 단위를 생략하면 px로 지정된다.
	}
	return <div style={style}>{name}</div>;
}
```

### class 대신 className

JSX에서는 class 속성을 className으로 지정해야 한다.

```jsx
function App() {
	const name = '리액트';
	return <div className="react">{name}</div>;
}
```

### 꼭 닫아야 하는 태그

JSX에서는 태그를 닫지 않으면 오류가 발생한다. 하지만 태그 사이에 별도의 내용이 들어가지 않는 경우라면 self-closing 태그를 사용하여 태그를 선언하면서 동시에 닫을 수 있다.

```jsx
function App() {
	const name = '리액트';
  return (
		<>
			<div className="react">{name}</div>
			<input />
		</>
  );
}
```

### 주석

```jsx
function App() {
	const name = '리액트';
  return (
		<>
			{/*주석은 이렇게 작성한다.*/}
			<div className="react" // 시작 태그를 여러 줄로 작성할 때는 이렇게도 가능하다.
			>
				{name}
			</div>
			<input />
		</>
  );
}
```