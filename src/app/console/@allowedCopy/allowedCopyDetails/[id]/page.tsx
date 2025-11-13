import MiniDashDetails from '@/(components)/panelComp/MiniDashDetails'
import React from 'react'

function page() {
  return (
    <MiniDashDetails type='user' axiosGet='/api/console/allowed-users' axiosPut='/api/console/allowed-users' title='allowed Copy' deleteMethod='allowedUser' />
  )
}

export default page