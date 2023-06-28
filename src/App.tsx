import { Admin, Resource } from "react-admin"; // ListGuesser, EditGuesser
import { dataProvider } from "./dataProvider";
import { UserList } from "./users";
import PostList, { PostCreate, PostEdit } from "./posts";
import PostIcon from "@mui/icons-material/Book";
import UserIcon from "@mui/icons-material/Group";
import Dashboard from "./Dashboard";
import { authProvider } from "./AuthProvider";

export const App = () => (
  <Admin
    dataProvider={dataProvider}
    dashboard={Dashboard}
    authProvider={authProvider}
  >
    <Resource
      name="users"
      list={UserList}
      recordRepresentation="name"
      icon={UserIcon}
    />
    <Resource
      name="posts"
      // recordRepresentation="title" // optional way to display title as header, limited to strings only
      list={PostList}
      edit={PostEdit}
      icon={PostIcon}
      //  can't see create button when screen shrunk
      create={PostCreate}
    />
  </Admin>
);
