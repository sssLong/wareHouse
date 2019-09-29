const env = process.env.NODE_ENV

let query = {
	page: 1,
	limit: 10
}

switch (env) {
	case 'development':
	case 'production':
	case 'test':
		break
}

export {
	env,
	query
}
