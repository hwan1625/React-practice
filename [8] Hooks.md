# [8] Hooks

생성일: 2021년 12월 29일 오후 2:14

Hooks는 리액트 v16.8에 새로 도입된 기능으로 함수형 컴포넌트에서도 상태 관리를 할 수 있는 `useState`, 렌더링 직후 작업을 설정하는 `useEffect` 등의 기능을 제공하여 기존의 함수형 컴포넌트에서 할 수 없었던 다양한 작업을 할 수 있게 해 준다.

## useState

---

`useState`는 가장 기본적인 Hook이며, 함수형 컴포넌트에서도 **가변적인 상태**를 지닐 수 있게 해준다.

```jsx
import React, { useState } from 'react';
const Counter = () => {
    const [value, setValue] = useState(0);
    return (
        <div>
            <p>현재 카운터 값은 <b>{value}</b>입니다.</p>
            <button onClick={() => setValue(value + 1)}>+1</button>
            <button onClick={() => setValue(value - 1)}>-1</button>
        </div>
    );
}
export default Counter;
```

### useState를 여러 번 사용하기

```jsx
import React, { useState } from 'react';
const Info = () => {
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const onChangeName = e => {
        setName(e.target.value);
    }
    const onChangeNickname = e => {
        setNickname(e.target.value);
    }
    return (
        <div>
            <div>
                <input value={name} onChange={onChangeName} />
                <input value={nickname} onChange={onChangeNickname} />
            </div>
            <div>
                <div>
                    <b>이름:</b> {name}
                </div>
                <div>
                    <b>닉네임:</b> {nickname}
                </div>
            </div>
        </div>
    );
}
export default Info
```

## useEffect

---

`useEffect`는 리액트 컴포넌트가 **렌더링될 때마다** 특정 작업을 수행하도록 설정할 수 있는 Hook이다. 클래스형 컴포넌트의 componentDidMound와 componentDidUpdated를 합친 형태와 같다.

```jsx
// Info.js
...
useEffect(() => {
    console.log('렌더링이 완료되었습니다!');
    console.log({ name, nickname });
})
...
```

### 마운트될 때만 실행하고 싶을 때

`useEffect`에서 설정한 함수를 컴포넌트가 화면에 맨 처음 렌더링될 때만 실행하고, 업데이트될 때는 실행하지 않으려면 함수의 두 번째 파라미터로 비어 있는 배열을 넣어 주면 된다.

```jsx
useEffect(() => {
	console.log('마운트될 때만 실행됩니다.');
}, []);
```

### 특정 값이 업데이트될 때만 실행하고 싶을 때

`useEffect`의 두번째 파라미터로 전달되는 배열 안에 검사하고 싶은 값을 넣어 주면 된다.

```jsx
useEffect(() => {
	console.log(name);
}, [name]); // 배열 안에는 state, props 모두 가능하다.
```

### 뒷정리하기

컴포넌트가 언마운트되기 전이나 업데이트되기 직전에 어떠한 작업을 수행하고 싶다면 `useEffect`에서 뒷정리 함수를 반환해 주어야 한다.

```jsx
// Info.js
useEffect(() => {
    console.log('effect');
    console.log(name);
    return () => {
        console.log('cleanup');
        console.log(name);
    }
}, [name]);
```

```jsx
// App.js
const App = () => {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <button
        onClick={() => { setVisible(!visible); }}
      >
        {visible ? '숨기기' : '보이기'}
      </button>
      <hr />
      {visible && <Info />}
    </div>
  );
}
```

오직 언마운트될 때만 뒷정리 함수를 호출하고 싶다면 `useEffect` 함수의 두 번째 파라미터에 비어있는 배열을 넣으면 된다.

```jsx
useEffect(() => {
    console.log('effect');
    return () => {
        console.log('unmount');
    }
}, []); 
```

## useReducer

---

`useReducer`는 `useState`보다 더 다양한 컴포넌트 상황에 따라 다양한 상태를 다른 값으로 업데이트해 주고 싶을 때 사용하는 Hook이다.

**리듀서**는 현재 상태, 그리고 업데이트를 위해 필요한 정보를 담은 액션 값을 전달받아 새로운 상태를 반환하는 함수이다. 리듀서 함수에서 새로운 상태를 만들 때는 반드시 **불변성**을 지켜주어야 한다.

```jsx
function reducer(state, action) {
	return {...};  // 불변성을 지키면서 업데이트한 새로운 상태를 반환한다.
}
```

액션 값은 주로 `{ type: ‘INCREMENT’ ... }` 같은 형태로 이루어져 있다. 리덕스에서 사용하는 액션 객체에는 어떤 액션인지 알려 주는 type 필드가 꼭 있어야 하지만, `useReducer`에서 사용하는 액션 객체는 반드시 type을 지니고 있을 필요가 없다.

```jsx
import React, { useReducer } from 'react';
function reducer(state, action) {
    switch (action.type) {
        case 'INCREMENT':
            return { value: state.value + 1 };
        case 'DECREMENT':
            return { value: state.value - 1 };
        default:
            return state;
    }
}
const Counter = () => {
    const [state, dispatch] = useReducer(reducer, { value: 0 });
    return (
        <div>
            <p>현재 카운터 값은 <b>{state.value}</b>입니다.</p>
            <button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
            <button onClick={() => dispatch({ type: 'DECREMENT' })}>-1</button>
        </div>
    );
}
export default Counter;
```

`useReducer`의 첫 번째 파라미터에는 리듀서 함수를 넣고, 두 번째 파라미터에너는 해당 리듀서의 기본값을 넣어 준다. 이 Hook을 사용하면 `state` 값과 `dispatch` 함수를 받아 온다. state는 현재 가리키고 있는 상태고, dispatch는 액션을 발생시키는 함수이다.

`useReducer`를 사용했을 때의 가장 큰 장점은 컴포넌트 업데이트 로직을 컴포넌트 바깥으로 빼낼 수 있다는 것이다.

### input 상태 관리하기

기존에는 input 여러 개를 `useState` 여러 번 사용하여 해결했지만 `useReducer`를 사용하면 기존에 클래스형 컴포넌트에서 input 태그에 name 값을 할당하고 `e.target.name`을 참조하여 `setState`를 해 준 것과 유사한 방식으로 작업을 처리할 수 있다.

```jsx
import React, { useReducer } from 'react';
function reducer(state, action) {
    return {
        ...state,
        [action.name]: action.value
    };
}
const Info = () => {
    const [state, dispatch] = useReducer(reducer, { name: '', nickname: '' });
    const { name, nickname } = state;
    const onChange = e => {
        dispatch(e.target);
    }
    return (
        <div>
            <div>
                <input name="name" value={name} onChange={onChange} />
                <input name="nickname" value={nickname} onChange={onChange} />
            </div>
            <div>
                <div>
                    <b>이름:</b> {name}
                </div>
                <div>
                    <b>닉네임:</b> {nickname}
                </div>
            </div>
        </div>
    );
}
export default Info;
```

## useMemo

---

`useMemo`를 사용하면 함수형 컴포넌트 내부에서 발생하는 연산을 **최적화**할 수 있다.

```jsx
import React, { useState, useMemo } from 'react';
const getAverage = numbers => {
    console.log('평균값 계산 중..');
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((a, b) => a + b);
    return sum / numbers.length;
};
const Average = () => {
    const [list, setList] = useState([]);
    const [number, setNumber] = useState('');
    const onChange = e => {
        setNumber(e.target.value);
    }
    const onInsert = e => {
        const nextList = list.concat(parseInt(number));
        setList(nextList);
        setNumber('');
    }
    // const avg = useMemo(() => getAverage(list), [list]);
    return (
        <div>
            <input value={number} onChange={onChange} />
            <button onClick={onInsert}>등록</button>
            <ul>
                {list.map((value, index) => (
                    <li key={index}>{value}</li>
                ))}
            </ul>
            <div>
                <b>평균값:</b> {getAverage(list)} // {avg}
            </div>
        </div>
    );
};
export default Average;
```

위 코드를 실행하면 숫자를 등록할 때 뿐만 아니라 input 내용이 수정될 때도 `getAverage` 함수가 호출되는 것을 확인할 수 있다.

`useMemo` Hook을 사용하면 이러한 작업을 **최적화**할 수 있다. 렌더링하는 과정에서 특정 값이 바뀌었을 때만 연산을 실행하고, 원하는 값이 바뀌지 않았다면 이전에 연산했던 결과를 다시 사용하는 방식이다.

## useCallback

---

`useCallback`은 `useMemo`와 비슷하며, 주로 렌더링 성능을 **최적화**해야 하는 상황에서 사용한다.

```jsx
const Average = () => {
    ...
    const onChange = useCallback(e => {
        setNumber(e.target.value);
    }, []);  // 컴포넌트가 처음 렌더링될 때만 함수 생성
    const onInsert = useCallback(e => {
        const nextList = list.concat(parseInt(number));
        setList(nextList);
        setNumber('');
    }, [number, list]);  // number 혹은 list가 바뀌었을 때만 함수 생성
    ...
    return (
        ...
    );
};
```

`useCallback`의 첫 번째 파라미터에는 생성하고 싶은 함수를 넣고, 두 번째 파라미터에는 배열을 넣으면 된다. 이 배열에는 어떤 값이 바뀌었을 때 함수를 생성해야 하는지 명시해야 한다.

비어있는 배열을 넣게 되면 컴포넌트가 렌더링될 때 만들었던 함수를 계속해서 재사용하게 되며 배열 안에 요소를 넣게 되면 인풋 내용이 바뀌거나 새로운 항목이 추가 될 때 새로 만들어진 함수를 사용하게 된다.

## useRef

---

`useRef` Hook은 함수형 컴포넌트에서 ref를 쉽게 사용할 수 있도록 해 준다.

```jsx
const Average = () => {
		...
    const inputEl = useRef(null);
    const onInsert = useCallback(e => {
        ...
        inputEl.current.focus();
    }, [number, list]);
    const avg = useMemo(() => getAverage(list), [list]);
    return (
        <div>
            <input value={number} onChange={onChange} ref={inputEl} />
            ...
        </div>
    );
};
export default Average;
```

`useRef`를 사용하여 ref를 설정하면 `useRef`를 통해 만든 객체 안의 current 값이 실제 엘리먼트를 가리킨다.

### 로컬 변수 사용하기

컴포넌트 로컬 변수를 사용해야 할 때도 useRef를 활용할 수 있다. 로컬 변수란 렌더링과 상관없이 바뀔 수 있는 값을 의미한다. 

```jsx
class MyComponent extends Componet {
	id = 1;
	setId = (n) => {
		this.id = n;
	}
	printId = () => {
		console.log(this.id);
	}
	render() {...}
}
```

```jsx
const RefSample = () => {
	const id = useReft(1);
	const setId = (n) => {
		id.current = n;
	}
	cosnt printId = () => {
		console.log(id.current);
	}
	return (...);
};
```

ref안의 값이 바뀌어도 컴포넌트가 렌더링되지 않는다는 점을 주의해야 한다.

## 커스텀 Hooks 만들기

---

여러 컴포넌트에서 비슷한 기능을 공유할 경우, 이를 자신만의 Hook으로 작성하여 로직을 재사용할 수 있다.

```jsx
import { useReducer } from 'react';
function reducer(state, action) {
    return {
        ...state,
        [action.name]: action.value
    };
}
export default function useInputs(initialForm) {
    const [state, dispatch] = useReducer(reducer, initialForm);
    const onChange = e => {
        dispatch(e.target);
    };
    return [state, onChange];
}
```

```jsx
import React, { useReducer } from 'react';
import useInputs from './useInputs';
function reducer(state, action) {
    return {
        ...state,
        [action.name]: action.value
    };
}
const Info = () => {
    const [state, onChange] = useInputs({ name: '', nickname: '' });
    const { name, nickname } = state;
    return (
        <div>
            <div>
                <input name="name" value={name} onChange={onChange} />
                <input name="nickname" value={nickname} onChange={onChange} />
            </div>
            <div>
                <div>
                    <b>이름:</b> {name}
                </div>
                <div>
                    <b>닉네임:</b> {nickname}
                </div>
            </div>
        </div>
    );
}
export default Info;
```

## 다른 Hooks

---

다른 개발자가 만든 Hooks도 라이브러리로 설치하여 사용할 수 있다.

- [https://nikgraf.github.io/react-hooks](https://nikgraf.github.io/react-hooks/)
- [https://github.com/rehooks/awesome-react-hooks](https://github.com/rehooks/awesome-react-hooks)