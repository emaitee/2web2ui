## Filter Dropdown

In a redux-form connected component, pass through formName, options, namespace, and displayValue.
```js
<FilterDropdown
  // Your redux-form name. Used to select its own values from state
  formName='my-filters-form'

  // Options that will appear in the ActionList
  options={statusOptions}

  // The namespace you wish to nest your options under
  namespace='status'

  // The value that will be displayed in the TextField
  displayValue='Status'
/>
```

Options should be structured like this:
```js
const statusOptions = [
  {
    content: 'Draft', // The label displayed in the ActionList
    name: 'draft' // The key where this fields value will be placed
  }, {
    content: 'Published',
    name: 'published'
  }
];
```

Filter values will be available in the redux-form store:
```js
form: {
 'my-filters-form': {
   values: {
     'status': {
       'draft': false,
       'published': false
     }
   }
 }
}
```

To set initial values, pass them through mapStateToProps. EG:
```js
const mapStateToProps = (state) => ({
  initialValues: {
    status: {
      draft: true,
      published: false
    }
  }
});

const formOptions = {
  form: 'my-filters-form'
};
export default connect(mapStateToProps, {})(reduxForm(formOptions)(YourFilterComponent));
```
