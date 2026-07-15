/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { Toolbar } from "@/components/toolbar";
import { UserDialog } from "./components/add-update-user";
import { useEffect, useState } from "react";
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from "@/hooks/use-users";
import { UserDTO } from "@/types";
import { DataTableColumn, DataTable } from "@/components/data-table";
import { Delete, Edit, User } from "lucide-react";
import { useDebounce } from "use-debounce";
import { ActionsDropdown } from "@/components/table-action-dropdown";
import { TUserDTO } from "@/types/user";
import { toast } from "sonner";





export default function UserManagement() {

  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10)
  const [status, setStatus] = useState<string>("ACTIVE");
  const [debouncedSearch] = useDebounce(search, 500)
  const { data, isLoading } = useUsers({ page, search: debouncedSearch, status, limit })
  const { mutate: createUser, isPending: creatingUser,isSuccess:createUserSuccess,error:createUserError} = useCreateUser()
  const { mutate: updateUser, isPending: updatingUser,isSuccess:updateUserSuccess,error:updateUserError } = useUpdateUser()
  const { mutate: deleteUser,isSuccess:deleteUserSuccess,error:deleteUserError } = useDeleteUser()
  

  const [editingId, setEditingId] = useState<number | undefined>(undefined)
  const [editValues, setEditValues] = useState<TUserDTO | null>(null)

  useEffect(() => {
    if (!editingId) {
      setEditValues(null)
      setOpen(false)
      return
    }
    const values = data?.items.find(entry => entry.id === editingId)
    setEditValues(values as TUserDTO)
    setOpen(true);
  }, [editValues, editingId])

  useEffect(()=>{
    if(createUserSuccess){
      toast.success("User Created Succesfully");
      setOpen(false);
    } 
    if(createUserError){
      toast.error("Network Error");
    
    }

  },[createUserSuccess,createUserError,creatingUser])

  useEffect(()=>{
    if(updateUserSuccess){
      toast.success("User Updated successfully");
      setOpen(false);
      setEditValues(null);
      setEditingId(undefined);
    }
    if(updateUserError){
      toast.error("Network Error");
    }
  },[updateUserSuccess,updateUserError,updateUser])

  const columns: DataTableColumn<UserDTO>[] = [
    {
      label: "Name",
      dataIndex: "name",
      className: "pl-5",
    },
    {
      label: "Email",
      dataIndex: "email",

    },
    {
      label: "Created",
      dataIndex: "createdAt",
      render: (date) => (
        <span className="text-xs font-semibold text-text-secondary">
          {new Date(date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      label: "Updated",
      dataIndex: "updatedAt",
      render: (date) => (
        <span className="text-xs font-semibold text-text-secondary">
          {new Date(date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      label: "Actions",
      dataIndex: "id",
      render: (id) => <ActionsDropdown
        actions={[
          { label: "Edit", icon: <Edit className="text-warning" />, onClick: () => setEditingId(id) },
          { label: "Delete", icon: <Delete className="text-error" />, onClick: () => toast.success("Deleting user with id: " + id) }
        ]}
      />
    }
  ];


  const paginationInfo = {
    page: page,
    limit: 10,
    totalItems: data?.pagination?.totalItems ?? data?.items?.length ?? 0,
    totalPages: data?.pagination?.totalPages ?? 1,
  };


  const emptyStatePlaceholder = (
    <div className="relative overflow-hidden rounded-xl bg-surface p-12 text-center flex flex-col items-center justify-center min-h-[280px] group">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl mb-4 bg-background-secondary border border-border text-secondary transition-transform duration-200 group-hover:scale-105">
        <User className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <h3 className="text-text text-sm font-semibold tracking-tight mb-1.5">
        No users added yet
      </h3>
      <p className="text-text-secondary text-xs max-w-60 leading-relaxed">
        Create your first user.
      </p>
    </div>
  );


  return (<main className="flex-1 transition-colors duration-150 flex flex-col gap-4 pb-20">
    <Toolbar
      searchQuery={search}
      onSearchChange={setSearch}
      onCreate={() => { setOpen( true) }}
      createLabel="Add User"

    />

    <DataTable
      columns={columns}
      data={data?.items ?? []}
      pagination={paginationInfo}
      onNext={setPage}
      onPrev={setPage}
      onLimitChange={setLimit}
      emptyState={emptyStatePlaceholder}
    />


    <UserDialog
      open={open}
      onOpenChange={
        ()=>{
          setEditValues(null);
          setEditingId(undefined);
          setOpen(false);
        }
      }
      mode={editingId ? "edit" : "create"}
      initialValues={
        editValues ?
          {
            email: editValues?.email,
            name: editValues?.name,
            status: editValues?.status
          }
          : {
            email: "",
            name: "",
            status: ""
          }}
      onSubmit={values => {
        if (editingId) {
          updateUser({
            id: editingId,
            data: {
              name: values.name,
              email: values.email,
              status: values.status
            }
          })
        } else {
          createUser({ ...values, password: values.password as string })
        }
      }}
    />
  </main>)
}




