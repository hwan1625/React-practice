# [10] 일정 관리 웹 애플리케이션 만들기

생성일: 2021년 12월 29일 오후 2:16

## 프로젝트 준비하기

---

```scss
yarn create react-app todo-app
cd todo-app
yarn add nod-sass@4.14.1 classnames react-icons
```

react-icons는 리액트에서 다양하고 예쁜 아이콘을 사용할 수 있는 라이브러리이다. SVG 형태로 이루어진 아이콘을 리액트 컴포넌트처럼 매우 쉽게 사용할 수 있다.

```scss
// 최상위 폴더에 .prettierrc 추가
{
	"singleQuote": true,
	"semi": true,
	"useTabs": false,
	"tabWidth": 2,
	"trailingComma": "all",
	"printWidth": 80
}
```

```scss
// index.css 수정
body {
	margin: 0;
	padding: 0;
	background: #e9ecef;
}
```

## UI 구성하기

---

- TodoTemplate : 화면을 가운데에 정렬시켜 주며, 앱 타이틀을 보여준다.
- TodoInsert : 새로운 항목을 입력하고 추가할 수 있는 컴포넌트
- TodoListItem : 각 할 일 항목에 대한 정보를 보여 주는 컴포넌트
- TodoList : todos 배열을 props로 받아 온 후, 여러 개의 TodoListItem 컴포넌트로 변환

### TodoTemplate 만들기

```jsx
import React from 'react';
import './TodoTemplate.scss';
const TodoTemplate = ({ children }) => {
    return (
        <div className="TodoTemplate">
            <div className="app-title">일정 관리</div>
            <div className="content">{children}</div>
        </div>
    );
}
export default TodoTemplate;
```

### TodoInsert 만들기

```jsx
import React from 'react';
import { MdAdd } from 'react-icons/md';
import './TodoInsert.scss';
const TodoInsert = () => {
    return (
        <form className="TodoInsert">
            <input placeholder="할 일을 입력하세요" />
            <button type="submit">
                <MdAdd />
            </button>
        </form>
    );
}
export default TodoInsert;
```

- react-icons : [https://react-icons.netlify.com/#/icons/md](https://react-icons.netlify.com/#/icons/md) 
`import { 아이콘 이름 } from "react-icons/md";`

### TodoListItem과 TodoList 만들기

```jsx
import React from 'react';
import {
    MdCheckBoxOutlineBlank,
    MdRemoveCircleOutline,
} from 'react-icons/md';
import './TodoListItem.scss';
const TodoListItem = () => {
    return (
        <div className="TodoListItem">
            <div className="checkbox">
                <MdCheckBoxOutlineBlank />
                <div className="text">할 일</div>
            </div>
            <div className="remove">
                <MdRemoveCircleOutline />
            </div>
        </div>
    );
}
export default TodoListItem;
```

```jsx
import React from 'react';
import TodoListItem from './TodoListItem';
import './TodoList.scss';
const TodoList = () => {
    return (
        <div className="TodoList">
            <TodoListItem />
            <TodoListItem />
            <TodoListItem />
        </div>
    );
}
export default TodoList;
```

## 기능 구현하기

---

### App에서 todo 상태 사용하기

App에서 useState를 사용하여 todo라는 상태를 정의하고, todos를 TodoList의 props로 전달한다.

```jsx
const App = () => {
  **const [todos, setTodos] = useState([
    {
      id: 1,
      text: '리액트의 기초 알아보기',
      checked: true,
    },
    {
      id: 2,
      text: '컴포넌트 스타일링해 보기',
      checked: true,
    },
    {
      id: 3,
      text: '일정 관리 앱 만들어 보기',
      checked: false,
    },
  ]);**
  return (
    <TodoTemplate>
      <TodoInsert />
      <TodoList todos=**{todos}** />
    </TodoTemplate>
  );
}
```

props로 받아 온 todos 배열을 배열 내장 함수 map을 통해 TodoListItem으로 이루어진 배열로 변환하여 렌더링해 준다.

```jsx
const TodoList = (**{ todos }**) => {
    return (
        <div className="TodoList">
            **{todos.map(todo => (
                <TodoListItem todo={todo} key={todo.id} />
            ))}**
        </div>
    );
};
```

TodoListItem 컴포넌트에서 받아 온 todo 값에 따라 제대로 된 UI를 보여 줄 수 있도록 컴포넌트를 수정한다.

```jsx
**import cn from 'classnames';**

const TodoListItem = (**{ todo }**) => {
    **const { text, checked } = todo;**
    return (
        <div className="TodoListItem">
            <div **className={cn('checkbox', { checked })}**>
                **{checked ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}**
                <div className="text">**{text}**</div>
            </div>
            ...
        </div>
    );
}
```

### 항목 추가 기능 구현하기

이 기능을 구현하려면, TodoInsert 컴포넌트에서 인풋 상태를 관리하고 App 컴포넌트에는 todos 배열에 새로운 객체를 추가하는 함수를 만들어 주어야 한다.

```jsx
const TodoInsert = () => {
    **const [value, setValue] = useState('');**
    **const onChange = useCallback(e => {
        setValue(e.target.value);
    }, []);**
    return (
        <form className="TodoInsert">
            <input
                placeholder="할 일을 입력하세요"
                value={value}
                **onChange={onChange}**
            />
            ...
        </form>
    );
}
```

```jsx
const App = () => {
  ...
  **const nextId = useRef(4);
  const onInsert = useCallback(**
    **text => {
      const todo = {
        id: nextId.current,
        text,
        checkec: false,
      };
      setTodos(todos.concat(todo));
      nextId.current += 1;
    },
    [todos],
  );**
  return (
    <TodoTemplate>
      <TodoInsert **onInsert={onInsert}** />
      <TodoList todos={todos} />
    </TodoTemplate>
  );
}
```

버튼을 클릭하여 onSubmit 이벤트가 발생하면 항목이 추가된다.

```jsx
const TodoInsert = (**{ onInsert }**) => {
    ...
    **const onSubmit = useCallback(
        e => {
            onInsert(value);
            setValue('');
            e.preventDefault(); // 새로고침 방지
        },
        [onInsert, value],
    );**
    return (
        <form className="TodoInsert" **onSubmit={onSubmit}**>
            ...
        </form>
    );
}
```

### 지우기 기능 구현하기

```jsx
const App = () => {
  ...
  **const onRemove = useCallback(
    id => {
      setTodos(todos.filter(todo => todo.id !== id));
    },
    [todos],
  );**
  return (
    <TodoTemplate>
      <TodoInsert onInsert={onInsert} />
      <TodoList todos={todos} **onRemove={onRemove}** />
    </TodoTemplate>
  );
}
```

TodoListItem에서 삭제 함수 호출한다.

```jsx
const TodoList = ({ todos, **onRemove** }) => {
    return (
        <div className="TodoList">
            {todos.map(todo => (
                <TodoListItem todo={todo} key={todo.id} **onRemove={onRemove}** />
            ))}
        </div>
    );
};
```

삭제 버튼을 누르면 TodoListItem에서 onRemove 함수에 현재 자신이 가진 id를 넣어서 삭제 함수를 호출한다.

```jsx
const TodoListItem = ({ todo, onRemove }) => {
    const { **id**, text, checked } = todo;
    return (
        <div className="TodoListItem">
            ...
            <div className="remove" **onClick={() => onRemove(id)}**>
                <MdRemoveCircleOutline />
            </div>
        </div>
    );
}
```

### 수정 기능

onToggle이라는 함수를 App에 만들고, 해당 함수를 TodoList 컴포넌트에게 props로 넣어 준다. 그다음에는 TodoList를 통해 TodoListItem까지 전달해 주면 된다.

```jsx
const App = () => {
  ...
  **const onToggle = useCallback(
    id => {
      setTodos(
        todos.map(todo =>
          todo.id === id ? { ...todo, checked: !todo.checked } : todo,
        ),
      );
    },
    [todos],
  );**
  return (
    <TodoTemplate>
      <TodoInsert onInsert={onInsert} />
      <TodoList todos={todos} onRemove={onRemove} **onToggle={onToggle}** />
    </TodoTemplate>
  );
}
```

TodoListItem에서 토글 함수를 호출한다.

```jsx
const TodoList = ({ todos, onRemove, **onToggle** }) => {
    return (
        <div className="TodoList">
            {todos.map(todo => (
                <TodoListItem
                    todo={todo}
                    key={todo.id}
                    onRemove={onRemove}
                    **onToggle={onToggle}**
                />
            ))}
        </div>
    );
};
```

```jsx
const TodoListItem = ({ todo, onRemove, **onToggle** }) => {
    const { id, text, checked } = todo;
    return (
        <div className="TodoListItem">
            <div className={cn('checkbox', { checked })} **onClick={() => onToggle(id)}**>
                {checked ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                <div className="text">{text}</div>
            </div>
            ...
        </div>
    );
}
```