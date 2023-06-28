import {
  Datagrid,
  EditButton,
  List,
  ReferenceField,
  TextField,
  Edit,
  ReferenceInput,
  SimpleForm,
  TextInput,
  Create,
  useRecordContext,
} from "react-admin";

const PostTitle = () => {
  const record = useRecordContext();
  //   Question -- why do i need string literal for the record.title, is this so that you aren't limited to a string
  return (
    <span>
      Post {record ? `${record.title}` : ""}
      {/* the record can be accessed directly w/ the url so it could display while still 
      being fetched which is why it's imperative to check for the existence of the record */}
    </span>
  );
};

const PostFilters = [
  <TextInput source="q" label="Search" alwaysOn />,
  <ReferenceInput source="userId" label="User" reference="users" />,
];

export const PostList = () => (
  <List filters={PostFilters}>
    <Datagrid>
      <TextField source="id" />
      <ReferenceField source="userId" reference="users" />
      <TextField source="title" />
      <EditButton />
    </Datagrid>
  </List>
);

export const PostEdit = () => (
  // Question -- why does this need angle brackets - is this to render a component as a title
  <Edit title={<PostTitle />}>
    <SimpleForm>
      <TextInput source="id" disabled />
      <ReferenceInput source="userId" reference="users" />
      <TextInput source="title" />
      {/* The label prop can be added to any input */}
      <TextInput label="comment" source="body" multiline rows={5} />
    </SimpleForm>
  </Edit>
);

export const PostCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="userId" reference="users" />
      <TextInput source="title" />
      <TextInput label="comment" source="body" multiline rows={5} />
    </SimpleForm>
  </Create>
);

export default PostList;
