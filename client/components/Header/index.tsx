import Link from 'next/link'
import React from 'react'
import Account from './Account'

const Header = ({ accountRole }: {accountRole: 'guest' | 'user'}) => {
  return <nav className="flex flex-row justify-between items-baseline bg-gray-800 border-b-gray-500 pt-5 pb-4 px-10">
    <Link href="/" className="font-bold text-xl text-white">SmartBin</Link>
    <div className="flex flex-row gap-5 font-medium text-md text-white items-center">
      <Link href="/" className="hover:text-blue-500 transition-colors duration-200">Dashboard</Link>
      { accountRole == "user" && <Link href="/system-alert" className="hover:text-blue-500 transition-colors duration-200">System Alerts</Link> }
      <Account accountRole={accountRole}/>
    </div>
  </nav>
}

export default Header