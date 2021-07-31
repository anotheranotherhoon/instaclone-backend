import client from "../../client";
import protectedResolver from "../../users/users.utils";

export default {
	Query: {
		me: protectedResolver((_, _, { loggedInUser }) =>
			client.user.findUnique({
				where: {
					id: loggedInUser.id,
				},
			})
		),
	}
}