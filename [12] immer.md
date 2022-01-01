# [12] immer를 사용하여 더 쉽게 불변성 유지하기

생성일: 2021년 12월 29일 오후 2:16

- 프로젝트에서 복잡한 상태를 다룰 때, 전개 연산자를 여러 번 사용하는 것은 꽤 번거러운 작업이다. 가독성 또한 좋지 않다.
    
    ```jsx
    import React, { useRef, useCallback, useState } from 'react';
    
    const App = () => {
      const nextId = useRef(1);
      const [form, setForm] = useState({ name: '', username: '' });
      const [data, setData] = useState({
        array: [],
        uselessValue: null
      });
      const onChange = useCallback(
        e => {
          const { name, value } = e.target;
          setForm({
            ...form,
            [name]: [value]
          });
        },
        [form]
      );
      const onSubmit = useCallback(
        e => {
          e.preventDefault();
          const info = {
            id: nextId.current,
            name: form.name,
            username: form.username
          };
          setData({
            ...data,
            array: data.array.concat(info)
          });
          setForm({
            name: '',
            username: ''
          });
          nextId.current += 1;
        },
        [data, form.name, form.username]
      );
      const onRemove = useCallback(
        id => {
          setData({
            ...data,
            array: data.array.filter(info => info.id !== id)
          });
        },
        [data]
      );
      return (
        <div>
          <form onSubmit={onSubmit}>
            <input
              name="username"
              placeholder="아이디"
              value={form.username}
              onChange={onChange}
            />
            <input
              name="name"
              placeholder="이름"
              value={form.name}
              onChange={onChange}
            />
            <button type="submit">등록</button>
          </form >
          <div>
            <ul>
              {data.array.map(info => (
                <li key={info.id} onClick={() => onRemove(info.id)}>
                  {info.username} ({info.name})
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
    
    export default App;
    ```
    

immer라는 라이브러리를 사용하면, 구조가 복잡한 객체도 매우 쉽고 짧은 코드를 사용하여 불변성을 유지하면서 업데이트해 줄 수 있다.

## immer를 설치하고 사용법 알아보기

---

`yarn add immer` , `npm install immer`

```jsx
import produce from 'immer';
const nextState = produce(originalState, draft => {
	draft.somewhere.deep.inside = 5;
});
```

`produce`라는 함수는 두 가지 파라미터를 받는다. 첫 번째 파라미터는 수정하고 싶은 상태이고, 두 번째 파라미터는 상태를 어떻게 업데이트할지 정의하는 함수이다.

두 번째 파라미터로 전달되는 함수 내부에서 원하는 값을 변경하면, `produce` 함수가 불변성 유지를 대신해 주면서 새로운 상태를 생성해 준다.

```jsx
const App = () => {
  ...
  const onChange = use
      setForm(
        **produce(form, draft => {
          draft[name] = value;
        })**
      );
    },
    [form]
  );
  const onSubmit = useCallback(
    e => {
      setData(
        **produce(data, draft => {
          draft.array.push(info);
        })**
      );
    },
    [data, form.name, form.username]
  );
  const onRemove = useCallback(
    id => {
      setData(
        **produce(data, draft => {
          draft.array.splice(draft.array.findIndex(info => info.id === id), 1);
        })**
      );
    },
    [data]
  );
  ...
}
```

immer를 사용하여 컴포넌트 상태를 작성할 때는 객체 안에 있는 값을 직접 수정하거나, 배열에 직접적인 변화를 일으키는 `push`, `splice` 등의 함수를 사용해도 무방하다. 

immer는 불변성을 유지하는 코드가 복잡할 때만 사용해도 충분하다.

### useState의 함수형 업데이트와 immer 함께 쓰기

immer의 속성과 useState의 함수형 업데이트를 함께 활용하면 코드를 더욱 깔끔하게 만들 수 있다.

```jsx
const [number, setNumber] = useState(0);
const onIncrease = useCallback(
	() => setNumber(prevNumber => prevNumber + 1),
	[],
);
```

immer에서 제공하는 `produce` 함수를 호출할 때, 첫 번째 파라미터가 함수 형태라면 업데이트 함수를 반환한다.

```jsx
const update = produce(draft => {
	draft.value = 2;
});
const originalState = {
	value: 1,
	foo: 'bar';
};
const nextState = update(originalState);
console.log(nextState);
```

```jsx
const App = () => {
  const onChange = useCallback(
    e => {
      setForm(
        produce(**draft =>** {
          draft[name] = value;
        })
      );
    },
    **[]**
  );
  const onSubmit = useCallback(
    e => {
      setData(
        produce(**draft =>** {
          draft.array.push(info);
        })
      );
    },
    **[form.name, form.username]**
  );
  const onRemove = useCallback(
    id => {
      setData(
        produce(**draft =>** {
          draft.array.splice(draft.array.findIndex(info => info.id === id), 1);
        })
      );
    },
    **[]**
  );
  ...
}
```