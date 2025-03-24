import { useEffect } from "react";
import { Button } from "./components/ui/button"
import { useRoleStore } from "./store/role.store";

export default function Home() {

  const { roles, fetchAllRoles, isLoading: rolesLoading, error: rolesError } = useRoleStore();

  useEffect(() => {
    fetchAllRoles();
    console.log(roles)
  }, []);
    return (
        <div>
            <Button>Click me</Button>
        </div>
    )
}
