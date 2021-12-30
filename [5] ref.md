# [5] ref: DOM에 이름 달기

생성일: 2021년 12월 29일 오후 2:15

## ref는 어떤 상황에서 사용해야 할까?

---

HTML에서 id를 사용하여 DOM에 이름을 다는 것처럼 리액트 프로젝트 내부에서 DOM에 이름을 다는 방법을 **ref** 개념이다.

ref는 **‘DOM을 꼭 직접적으로 건드려야 할 때’** 사용된다.

- 특정 input에 포커스 주기
- 스크롤 박스 조작하기
- Canvas 요소에 그림 그리기 등

```jsx
class ValidationSample extends Component {
    state = {
        password: '',
        clicked: false,
        validated: false
    }
    handleChange = (e) => {
        this.setState({ password: e.target.value });
    }
    handleButtonClick = (e) => {
        this.setState({ clicked: true, validated: this.state.password === '0000' })
    }
    render() {
        return (
            <div>
                <input
                    type="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    className={this.state.clicked ? (this.state.validated ? 'success' : 'failure') : ''}
                />
                <button onClick={this.handleButtonClick}>검증하기</button>
            </div>
        );
    }
}
```

## ref 사용

---

### 콜백 함수를 통한 ref 설정

ref를 만드는 가장 기본적인 방법은 콜백 함수를 사용하는 것이다. ref를 달고자 하는 요소에 ref라는 콜백 함수를 props로 전달해 주면 된다. 이 콜백 함수는 ref 값을 파라미터로 전달받는다. 그리고 함수 내부에서 파라미터로 받은 ref를 컴포넌트의 멤버 변수로 설정해 준다.

```jsx
<input ref={(ref) => {this.input=ref}} />
// ref 이름은 자유롭게 정할 수 있다. this.superman = ref
```

ValidationSample.js의 컴포넌트에 ref를 달아서 `onClick` 이벤트 후 텍스트 포커스가 사라지는 현상을 보완했다.

```jsx
...
handleButtonClick = (e) => {
        this.setState({ clicked: true, validated: this.state.password === '0000' });
        this.input.focus();
}
render() {
    return (
        <div>
            <input
                ref={(ref) => this.input = ref}
                ...
            />
            <button onClick={this.handleButtonClick}>검증하기</button>
        </div>
    );
}
...
```

### createRef를 통한 ref 설정

ref를 만드는 또 다른 방법은 리액트에 내장되어 있는 `createRef`라는 함수를 사용하는 것이다.

```jsx
class RefSample extends Component {
	input = React.createRef();
	handleFocus = () => {
		this.input.current.focus();
	}
	render() {
		return (
			<div>
				<input ref={this.input} />
			</div>
		);
	}
}
```

## 컴포넌트에 ref 달기

---

리액트에서는 컴포넌트에도 ref를 달 수 있다. 컴포넌트 내부에 있는 DOM을 컴포넌트 외부에서 사용할 때 주로 사용한다.

### 사용법

```jsx
<MyComponent ref={(ref) => {this.myComponent=ref}} />
```

이렇게 하면 MyComponent 내부의 메서드 및 멤버 변수에도 접근할 수 있다.

### 컴포넌트 초기 설정

```jsx
import React, { Component } from 'react';
class ScrollBox extends Component {
    
    render() {
        const style = {
            border: '1px solid black',
            height: '300px',
            width: '300px',
            overflow: 'auto',
            position: 'relative'
        };
        const innerStyle = {
            width: '100%',
            height: '650px',
            background: 'linear-gradient(white, black)'
        }
        return (
            <div
                style={style}
                ref={(ref) => { this.box = ref }}>
                <div style={innerStyle} />
            </div>
        );
    }
}
export default ScrollBox;
```

### 컴포넌트에 메스드 생성

```jsx
class ScrollBox extends Component {
    scrollToBottom = () => {
        const { scrollHeight, clientHeight } = this.box;
        // const scrollHeight = this.box.scrollHeight; ...
        this.box.scrollTop = scrollHeight - clientHeight; // 맨 밑으로
    }
    ...
}
```

### 컴포넌트에 ref 달고 내부 메서드 사용

```jsx
import React, { Component } from 'react';
import ScrollBox from './ScrollBox';
class App extends Component {
  render() {
    return (
      <div>
        <ScrollBox ref={(ref) => this.scrollBox = ref} />
        <button onClick={() => this.scrollBox.scrollToBottom()}>
          맨 밑으로
        </button>
      </div >
    );
  }
}
export default App;
```