import MiniDashCard from '@/(components)/panelComp/MiniDashCard'
import React from 'react'

function page() {
  return (
    <MiniDashCard detailPage='allowedCopy' axiosGet='/api/console/allowed-users' axiosPost='/api/console/allowed-users' title='Allowed Copy' type='user' searchKey={"email"} />
  )
}

export default page