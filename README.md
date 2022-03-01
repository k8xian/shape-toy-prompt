# Shape Toy Prompt 

`yarn install`  
`yarn start`  
[deployment link](https://shape-toy-prompt.vercel.app/)

## Structure
The project was initialized with [Create React App](https://create-react-app.dev/) and uses [Emotion](https://emotion.sh/docs/styled) for styled components and some inline styling. It uses [React Hooks](https://reactjs.org/docs/hooks-intro.html) to manage the states of the circle and rectangle components. The controls are handled by using [Mouse Events](https://developer.mozilla.org/en-US/docs/Web/API/Element#mouse_events) within the Canvas node, and the changes are stored in the respective states. The shapes can be manipulated via those mouse events and range and control [inputs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input). This project also uses [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) to preserve the most recent state of the canvas, and converts the canvas ref to .jpg via [.toDataURL](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL) for saving.

## Approach

This solution uses React Hooks to implement the features as they are shown in this [sample](https://youtu.be/0ZUG57eZwx4). React is a great choice for UI-heavy implementations that let you spin up a solution to something like this quickly. React alone is not great for managing complex data structures for projects like this where you want to store and manage a lot of little moving parts. This project would benefit from a state management tool like [Redux](https://redux.js.org/), [MobX](https://mobx.js.org/README.html), or [Jotai](https://jotai.org/docs/api/core). There would be different ways to implement the above, but I had concerns about the overhead of configuring too many libraries for this project when I had limited time to complete it. A state management tool would have been a higher fidelity solution to make adding multiple iterations of each shape type possible and managing each one.

## Bottlenecks

It is very clunky to maintain the state of these two shapes, and more, with this approach. Because canvas needs to rewrite the entire image when it moves to avoid “snakes,” I had to be sure I was adding additional calls to manage the other shape if it was on the page. I had to check if that shape was supposed to show a hover effect or a selection effect or both. This many operations would definitely make this page slow at a larger scale. It would be much better to have a single object that can be iterated through for all changes and drawn at once and have the parts of that object only be modified where there were changes. It would also be much easier to use a library like [this](https://konvajs.org/) that *does* abstract away the Canvas API because that's easier. Which is, of course, why the prompt specifies not to. If this were to really be scaled with a full backend, it seems like a great use case for [GraphQL](https://graphql.org/). 

For a more robust UI, I'd really like to use [Tailwind](https://tailwindcss.com/)/[twin.macro](https://github.com/ben-rogerson/twin.macro), but that required more configuration than I had time for. 

## Future Development
### Local Storage

This is mostly working, but a nicer solution would be creating a custom hook for it this like this [example](https://blog.logrocket.com/using-localstorage-react-hooks/).

### Undo / Redo

A unified data structure would be useful here. I could store the object every time there was a change and then have a counter for going through the storage array and discarding the "future" objects and restoring past ones. Here's an [example](https://redux.js.org/usage/implementing-undo-history) of how that could be handled in Redux.

### Save

This is working by [converting](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL) the Canvas Ref to .jpg file and then appending that element to the document via [document.createElement()](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement), and adding a click event that downloads the image.

## Defects

Currently the hover effect over the circle treats it as a square. I have a function incorporating better math into a simpler function, but I got lost somewhere implementing it with the mouse events, and forgot whether I was using values relative to the canvas or the whole window. That initial work is [here](https://github.com/k8xian/shape-toy-prompt/tree/math-refactor).