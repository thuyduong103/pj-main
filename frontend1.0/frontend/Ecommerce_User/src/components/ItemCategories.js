import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base_url } from "../utils/axiosConfig";

const ItemCategories = ({ itemCategories }) => {


  const [dataSubCategoires, setDataSubCategoires] = useState([])
  const [hover, setHover] = useState(false)

  useEffect(() => {
    if (hover) {
      handleGetSubCategories()
    }
  }, [hover])



  async function handleGetSubCategories() {
    axios.get(base_url + "subcategories/category/" + itemCategories._id).then((res) => {
      if (res.status === 200) {
        setDataSubCategoires(res.data)
      }
    })
  }


  return (
    <li style={{ position: 'relative' }} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Link className="dropdown-item text-white" to="">
        {itemCategories.title}
      </Link>
      {hover && <ul style={{ position: 'absolute', right: -295, width: 300, top: 0, background: 'white', maxHeight: 1000, overflowY: 'auto' }}>
        {dataSubCategoires.map((item, index) => {
          return (
            <li key={index}>
              <Link className="dropdown-item text-white" to={`search/${item._id}`}>
                <span style={{ color: 'black' }}>{item.title}</span>
              </Link>
            </li>
          )
        })}

      </ul>}
    </li>
  )
}

export default ItemCategories