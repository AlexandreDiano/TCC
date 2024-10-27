class RolesService
    def initialize(current_user)
        @current_user = current_user
    end

#door
    def is_my_door(door)
        door.domain == @current_user.domain
    end

    def is_my_user(user)
        if @current_user.admin?
            return true
        end

        if @current_user.superuser?
            if (user.domain == @current_user.domain && !user.admin?)
                return true
            end
        end

        return false        
    end

#user
    def is_it_me(user)
        user.id == @current_user.id
    end

    def is_my_user_or_me(user)
        is_it_me(user) || is_my_user(user)
    end

#key
    def is_my_key(key)
        if (@current_user.superuser?)
            return (key.door.domain == @current_user.domain)
        end
        return false
    end
    
#Permission
    def is_my_permission(permission)
        if (!@current_user.superuser?)
            return false
        end
        if (!is_my_door(permission.key.door))
            return false
        end
        return true
    end

end