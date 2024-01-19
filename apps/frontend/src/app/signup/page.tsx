import React from 'react'

const Signup: React.FC = () => {
  return (
    <div className='flex items-center justify-center h-screen w-screen bg-gray-900'>

      <div className='lg:w-[300px] flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-8'>
        <h1 className='text-3xl font-bold mb-8'>SIGN UP</h1>
        {/* Email */}
        <div className='mb-4 w-full'>
            <p className='text-gray-500 mb-2'>Email</p>
            <input className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
                    type='email'
                    placeholder='Email'/>
        </div>
        {/* Username */}
        <div className='mb-4 w-full'>
            <p className='text-gray-500 mb-2'>Username</p>
            <input className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
                    type='text'
                    placeholder='Username'/>
        </div>
        {/* Password */}
        <div className='mb-4 w-full'>
            <p className='text-gray-500 mb-2'>Password</p>
            <input className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500' 
					type='password'
					placeholder='Password'/>
        </div>
        {/* Confirm Password */}
        <div className='mb-4 w-full'>
            <p className='text-gray-500 mb-2'>Confirm Password</p>
            <input className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500' 
					type='password'
					placeholder='Confirm Password'/>
        </div>
        {/* Signup button */}
        <button className='w-full mb-4 py-2 px-4 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75'>
          Sign up
        </button>
        {/* OR */}
        <div className='relative w-full mb-4 py-5'>
            <div className='w-full h-1 bg-gray-200'></div>
            <p className='absolute left-1/2 top-1/2 -translate-x-[50%] -translate-y-[50%] z-10 inline-block px-2 bg-white text-gray-500 border border-gray-200'>OR</p>
        </div>
		<div className='flex gap-3'>
			{/* 42 OAuth */}
			<div className='mb-4'>
				<button className='w-12 h-12 rounded-full bg-42logo bg-cover '></button>
			</div>
			{/* Google OAuth */}
			<div className='mb-4'>
				<button className='w-12 h-12 rounded-full bg-googlelogo bg-cover '></button>
			</div>
		</div>
        {/* Sign up link */}
        <div className='text-center flex gap-1 max-sm:flex-col'>
            <p className='text-gray-500'>Already a user?</p>
            <a className='text-indigo-500 hover:underline' href='/login'>LOG IN</a>
        </div>
      </div>

    </div>
  )
}

export default Signup
