"use client"

import { useEffect, useState, useRef } from "react"
import { PlusOutlined } from "@ant-design/icons"
import { Divider, Input, Select, Space, Button } from "antd"
import type { InputRef } from "antd"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

let index = 0

const App: React.FC = (props) => {
  const supabase = createClientComponentClient()
  const [value, setValue] = useState(null)
  const [items, setItems] = useState([{ id: null, name: "Select list" }])
  const [name, setName] = useState("")
  const inputRef = useRef<InputRef>(null)

  useEffect(() => {
    async function doSearch() {
      const { data: lists } = await supabase.from("lists").select("id,name")
      setItems([...lists, { id: null, name: "Select list" }])
    }
    doSearch()
  }, [supabase])

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const addItem = async (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault()
    let { error, data } = await supabase.from("lists").insert({ name }).select()
    setItems([...items, data[0]])
    setName("")
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const handleChange = async (val) => {
    setValue(val)

    // const { error } = await supabase
    //   .from("cards_lists")
    //   .delete()
    //   .eq("list_id", )

    let res = await supabase
      .from("cards_lists")
      .insert({ list_id: val, card_id: props.card_id })
  }

  console.log(items.map((item) => ({ label: item.name, value: item.id })))

  return (
    <Select
      style={{ width: 300 }}
      placeholder="Select list"
      value={value}
      onChange={handleChange}
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider style={{ margin: "8px 0" }} />
          <Space style={{ padding: "0 8px 4px" }}>
            <Input
              placeholder="Please enter item"
              ref={inputRef}
              value={name}
              onChange={onNameChange}
            />
            <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
              Add item
            </Button>
          </Space>
        </>
      )}
      options={items.map((item) => ({ label: item.name, value: item.id }))}
    />
  )
}

export default App
