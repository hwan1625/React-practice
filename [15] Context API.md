# [15] Context API

생성일: 2021년 12월 29일 오후 2:16

Context API는 리액트 프로젝트에서 전역적으로 사용할 데이터가 있을 때 유용한 기능이다. 이를테면 사용자 로그인 정보, 애플리케이션 환경 설정, 테마 등이 있다. 

리덕스, 리액트 라우터, styled-components 등의 라이브러리는 Context API를 기반으로 구현되었다.

## Context API를 사용한 전역 상태 관리 흐름 이해하기

---

컴포넌트 전역에서 필요한 데이터가 있을 때는 주로 최상위 컴포넌트인 App의 state에 넣어서 관리한다.

리액트 프로젝트에서는 더 많은 컴포넌트를 거쳐야 할 때도 있고 다루어야 하는 데이터가 훨씬 많아질 수도 있으므로, 이런 방식을 사용하면 유지 보수성이 낮아질 가능성이 있다.

그렇기 때문에 리덕스나 MobX 같은 상태 관리 라이브러리를 사용하여 전역 상태 관리 작업을 더 편하게 처리하기도 한다. 

## Context API 사용법 익히기

---

```jsx
import { createContext } from 'react';
const ColorContext = createContext({ color: 'black' });
export default ColorContext;
```

### Consumer

ColorBox라는 컴포넌트를 만들어서 ColorContext 안에 들어 있는 색상을 보여 준다. 이때 색상을 props로 받아 오는 것이 아니라 ColorContext 안에 들어 있는 `Consumer`라는 컴포넌트를 통해 색상을 조회할 수 있다.

```jsx
import React from 'react';
import ColorContext from '../contexts/color';

const ColorBox = () => {
  return (
    <ColorContext.Consumer>
      {value => (
        <div
          style={{
            width: '64px',
            height: '64px',
            background: value.color
          }}
        />
      )}
    </ColorContext.Consumer>
  );
}

export default ColorBox;
```

`Consumer` 사이에 중괄호를 열어서 그 안에 함수를 넣는 패턴을 Function as a child, 혹은 Render Props라고 한다.

### Provider

`Provider`를 사용하면 Context의 `value`를 변경할 수 있다.

```jsx
const App = () => {
  return (
    <ColorContext.Provider **value={{ color: 'red' }}**>
      <div>
        <ColorBox />
      </div>
    </ColorContext.Provider>
  );
}
```

`Provider`를 사용했는데 기본값을 사용하지 않으면 오류가 발생한다.

## 동적 Context 사용하기

---

```jsx
import { createContext, useState } from 'react';

const ColorContext = createContext({
  state: { color: 'black', subcolor: 'red' },
  actions: {
    setcolor: () => { },
    setSubcolor: () => { }
  }
});

const ColorProvider = ({ children }) => {
  const [color, setColor] = useState('black');
  const [subcolor, setSubcolor] = useState('red');
  const value = {
    state: { color, subcolor },
    actions: { setColor, setSubcolor }
  };
  return (
    <ColorContext.Provider value={value}>{children}</ColorContext.Provider>
  );
};

const { Consumer: ColorConsumer } = ColorContext;

export { ColorProvider, ColorConsumer };

export default ColorContext;
```

위 코드에서 ColorProvider라는 컴포넌트는 `ColorContext.Provider`를 렌더링하고 있다. 이 Provider의 `value`에는 상태는 `state`로, 업데이트 함수는 `actions`로 묶어서 전달하고 있다. Context에서 값을 동적으로 사용할 때 반드시 묶어 줄 필요는 없지만, `state`와 `actions` 객체를 따로 분리해 주면 나중에 다른 컴포넌트에서 Context의 값을 사용할 때 편리하다.

```jsx
const App = () => {
  return (
    **<ColorProvider>**
      <div>
        <ColorBox />
      </div>
    **</ColorProvider>**
  );
}
```

```jsx
const ColorBox = () => {
  return (
    **<ColorConsumer>**
      {**({ state })** => (
        <>
          <div
            style={{
              width: '64px',
              height: '64px',
              background: **state**.color
            }}
          />
          <div
            style={{
              width: '32px',
              height: '32px',
              background: **state**.subcolor
            }}
          />
        </>
      )}
    **</ColorConsumer>**
  );
}
```

```jsx
import React from 'react';
import { ColorConsumer } from '../contexts/color';

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

const SelectColors = () => {
  return (
    <div>
      <h2>색상을 선택하세요.</h2>
      <ColorConsumer>
        {({ actions }) => (
          <div style={{ display: 'flex' }}>
            {colors.map(color => (
              <div
                key={color}
                style={{
                  background: color,
                  width: '24px',
                  height: '24px',
                  cursor: 'pointer'
                }}
                onClick={() => actions.setColor(color)}
                onContextMenu={e => {
                  e.preventDefault();
                  actions.setSubcolor(color);
                }}
              />
            ))}
          </div>
        )}
      </ColorConsumer>
      <hr />
    </div>
  );
}

export default SelectColors;
```

## Consumer 대신 Hook 또는 static contextType 사용하기

---

### useContext Hook 사용하기 (함수형 컴포넌트)

```jsx
import React, { useContext } from 'react';
import ColorContext from '../contexts/color';

const ColorBox = () => {
  const { state } = useContext(ColorContext);
  return (
    <>
      <div
        style={{
          width: '64px',
          height: '64px',
          background: state.color
        }}
      />
      <div
        style={{
          width: '32px',
          height: '32px',
          background: state.subcolor
        }}
      />
    </>
  );
}

export default ColorBox;
```

`children`에 함수를 전달하는 Render Props 패턴이 불편하다면, `useContext` Hook을 사용하여 훨씬 편하게 Context 값을 조회할 수 있다.

### static contextType 사용하기 (클래스형 컴포넌트)

```jsx
import React, { Component } from 'react';
import { ColorContext } from '../contexts/color';

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

class SelectColors extends Component {
  static contextType = ColorContext;

  handleSetColor = color => {
    this.context.actions.setColor(color);
  };

  handleSetSubcolor = subcolor => {
    this.context.actions.setSubcolor(subcolor);
  };

  render() {
    return (
      <div>
        <h2>색상을 선택하세요.</h2>
        <div style={{ display: 'flex' }}>
          {colors.map(color => (
            <div
              key={color}
              style={{
                background: color,
                width: '24px',
                height: '24px',
                cursor: 'pointer'
              }}
              onClick={() => this.handleSetColor(color)}
              onContextMenu={e => {
                e.preventDefault();
                this.handleSetSubcolor(color);
              }}
            />
          ))}
        </div>
        <hr />
      </div>
    );
  }
}

export default SelectColors;
```

`static contextType`을 정의하면 클래스 메서드에서도 Context에 넣어 둔 함수를 호출할 수 있다는 장점이 있다. 하지만 한 클래스에서 하나의 Context 밖에 사용하지 못한다.

앞으로 새로운 컴포넌트를 작성할 때 클래스형으로 작성하는 일은 많지 않기 때문에 `useContext`를 사용하는 편이 좋다.