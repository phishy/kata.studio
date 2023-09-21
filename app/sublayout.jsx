"use client"

import App from "@/components/App"
import Logo from "@/components/Logo"
import Link from "next/link"
import Script from "next/script"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Fragment } from "react"
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function SubLayout(props) {
  let router = useRouter()
  const supabase = createClientComponentClient()

  const user = {
    name: props.session?.user?.email,
    email: props.session?.user?.email,
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  }

  const navigation = [
    { name: "JS Reference", href: "/reference", current: true },
    { name: "Kata", href: "/kata", current: true },
    { name: "Cards", href: "/cards", current: false },
    { name: "New Card", href: "/cards/new", current: false },
    { name: "Lists", href: "/lists", current: false },
  ]

  if (props.session?.user) {
    navigation.unshift({
      name: "Logout",
      href: "/logout",
      current: false,
      onClick: (e) => {
        e.preventDefault()
        supabase.auth.signOut()
        router.refresh()
      },
    })
  } else {
    navigation.unshift({ name: "Login", href: "/login", current: true })
  }

  const userNavigation = [
    // { name: "Your Profile", href: "#" },
    // { name: "Settings", href: "#" },
    // {
    //   name: "Sign out",
    //   href: "/logout",
    //   onClick: () => {
    //     alert("hi")
    //     supabase.auth.signOut()
    //   },
    // },
  ]

  return (
    <html className="h-full">
      <body className="h-full">
        {/* <Script type="text/javascript">
          {`;(function(){const birdeatsbug=(window.birdeatsbug=window.birdeatsbug||[]);if(birdeatsbug.initialize)return;if(birdeatsbug.invoked){if(window.console&&console.error){console.error('birdeatsbug snippet included twice.')}return}birdeatsbug.invoked=true;birdeatsbug.methods=['setOptions','trigger','resumeSession','takeScreenshot','startRecording','stopRecording','stopSession','uploadSession','deleteSession'];birdeatsbug.factory=function(method){return function(){const args=Array.prototype.slice.call(arguments);args.unshift(method);birdeatsbug.push(args);return birdeatsbug}};for(let i=0;i<birdeatsbug.methods.length;i++){const key=birdeatsbug.methods[i];birdeatsbug[key]=birdeatsbug.factory(key)}birdeatsbug.load=function(){const script=document.createElement('script');script.type='module';script.async=true;script.src='https://sdk.birdeatsbug.com/v2/core.js';const mountJsBefore=document.getElementsByTagName('script')[0]||document.body.firstChild;mountJsBefore.parentNode.insertBefore(script,mountJsBefore);const style=document.createElement('link');style.rel='stylesheet';style.type='text/css';style.href='https://sdk.birdeatsbug.com/v2/style.css';const mountCssBefore=document.querySelector('link[rel="stylesheet"]')||mountJsBefore;mountCssBefore.parentNode.insertBefore(style,mountCssBefore)};birdeatsbug.load();window.birdeatsbug.setOptions({publicAppId:'1522826c-f252-4d41-88fa-7c36df05a8f1'})})();
`}
        </Script> */}
        <div className="min-h-full">
          <Disclosure as="nav" className="bg-gray-900">
            {({ open }) => (
              <>
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Link href="/">
                          <Logo />
                        </Link>
                        {/* <img
                          className="h-8 w-8"
                          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                          alt="Your Company"
                        /> */}
                      </div>
                      <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                          {navigation.map((item) => (
                            <Link
                              key={item.name}
                              href={item.onClick ? "" : item.href}
                              onClick={item.onClick}
                              className={classNames(
                                item.current
                                  ? "bg-gray-900 text-white"
                                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                "rounded-md px-3 py-2 text-sm font-medium"
                              )}
                              aria-current={item.current ? "page" : undefined}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-4 flex items-center md:ml-6">
                        {/* <button
                          type="button"
                          className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">View notifications</span>
                          <BellIcon className="h-6 w-6" aria-hidden="true" />
                        </button> */}

                        {/* Profile dropdown */}
                        {/* <Menu as="div" className="relative ml-3">
                          <div>
                            <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                              <span className="absolute -inset-1.5" />
                              <span className="sr-only">Open user menu</span>
                              <img
                                className="h-8 w-8 rounded-full"
                                src={user.imageUrl}
                                alt=""
                              />
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {userNavigation.map((item) => (
                                <Menu.Item key={item.name}>
                                  {({ active }) => (
                                    <div
                                      // href={item.href}
                                      onClick={item.onClick}
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        "block px-4 py-2 text-sm text-gray-700"
                                      )}
                                    >
                                      {item.name}
                                    </div>
                                  )}
                                </Menu.Item>
                              ))}
                            </Menu.Items>
                          </Transition>
                        </Menu> */}
                      </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                      {/* Mobile menu button */}
                      <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Open main menu</span>
                        {open ? (
                          <XMarkIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        ) : (
                          <Bars3Icon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                  </div>
                </div>

                <Disclosure.Panel className="md:hidden">
                  <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                    {navigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.onClick ? "" : item.href}
                        onClick={item.onClick}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "block rounded-md px-3 py-2 text-base font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                  {/* <div className="border-t border-gray-700 pb-3 pt-4">
                    <div className="flex items-center px-5">
                      <div className="flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.imageUrl}
                          alt=""
                        />
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-white">
                          {user.name}
                        </div>
                        <div className="text-sm font-medium text-gray-400">
                          {user.email}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="mt-3 space-y-1 px-2">
                      {userNavigation.map((item) => (
                        <Disclosure.Button
                          key={item.name}
                          as="a"
                          // href={item.href}
                          onClick={item.onClick}
                          className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                        >
                          {item.name}
                        </Disclosure.Button>
                      ))}
                    </div>
                  </div> */}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>

          {/* <header className="bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
              <h1 className="text-lg font-semibold leading-6 text-gray-900">
                Dashboard
              </h1>
            </div>
          </header> */}
          <main>
            <div className="mx-auto">
              <App>{props.children}</App>
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
