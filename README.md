call-me-maybe
[See it live!](https://call-me-maybe-chat-app.herokuapp.com/)

Technologies
Plaidchat is a full-stack application built with:

Ruby on Rails
React
Redux
the WebSocket protocol (implemented with ActionCable)
Variations of BEM and SMACCS styling conventions
This project was a learning exercise with a goal of following the functionality and design of an existing online application (slack) in order to build a full-stack app which meets predetermined feature and style specifications.

Features
Live Chat
Users can chat live with any internet-connected user around the world. A demonstration showing the live chat functionality

Magic Link
Users can generate links to invite peers who are or aren't already registered on the site to easily join their chat. A demonstration showing the generation of an invite link

Error handling
Forms provide meaning error handling for users. Styles and components were written to be modular and scalable: forms and form fields are both reusable components with styling and error-handling built-in. A demonstration showing helpful error feedback

Protected routes
Routes are protected on both the frontend and backend to prevent users from accessing unauthorized resources. A demonstration showing that users cannot access unauthorized resources

Code examples
Protected routes
In addition to frontend protected routes, backend controller actions are also protected from unauthorized use.

# application_controller.rb
def require_login
  unless logged_in? || demo_user_creation?
    render json: [{error: 'You must be logged in'}], status: 401
  end
end

def require_logout
  if logged_in? && !current_user.is_demo
    render json: ['You cannot create a new session when already logged in'],
      status: 401
  end
end

# users_controller.rb
before_action :require_login, only: %i(search)
before_action :require_logout, only: %i(create)
Callbacks
The rails callback lifecycle is used to automatically generate appropriate records and fields based on user interaction (e.g. signing up generates team and channel memberships, an avatar, etc.)

# user.rb
after_initialize :ensure_session_token!
after_initialize :ensure_avatar_url!
after_initialize :write_standard_teams, if: :new_record?
before_validation :set_default_team_membership,
  if: :new_record?
Custom Validations
Custom ActiveRecord validations are used to mimick the behavior of the model application (slack).

# user.rb
validate :valid_username

def valid_username
  unless valid_username?
    errors.add(:username, "must contain only letters, numbers, " \
      "periods, hyphens, and underscores")
  end
end

def valid_username?
  return false if self.username =~ /[^a-zA-Z0-9\.\-\_]/
  true
end
Clean, modular, expressive code
Project was built with scalability, modularity, and clean code best practices in mind.

componentWillReceiveProps(nextProps) {
    this.checkTeamChange(nextProps)
    this.checkChannelsChange(nextProps)
  }

  checkTeamChange (nextProps) {
    const oldTeamId = Number(this.props.match.params.teamId)
    const newTeamId = Number(nextProps.match.params.teamId)
    if (oldTeamId !== newTeamId) {
      this.resetDefaultTeamMembershipId(newTeamId)
    }
  }

  checkChannelsChange (nextProps) {
    const oldTeamChannels = this.props.teamChannels
    const newTeamChannels = nextProps.teamChannels
    if (oldTeamChannels !== newTeamChannels) {
      this.unsubscribeChannels(oldTeamChannels)
      this.subscribeChannels(newTeamChannels)
    }
  }
/* assets/stylesheets/layout.css.scss */
.l-middle {
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* assets/stylesheets/globals/_mixins.scss */
@mixin text-shadow {
  text-shadow:
   -1px -1px 2px $shadow_solid_color,
    1px -1px 2px $shadow_solid_color,
    -1px 1px 2px $shadow_solid_color,
     1px 1px 2px $shadow_solid_color;
}
