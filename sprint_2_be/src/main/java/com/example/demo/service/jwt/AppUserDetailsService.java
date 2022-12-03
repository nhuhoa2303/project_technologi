package com.example.demo.service.jwt;


import com.example.demo.model.account.AppUser;
import com.example.demo.model.account.UserRole;
import com.example.demo.repository.IAppUserRepository;
import com.example.demo.repository.IUserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AppUserDetailsService  implements UserDetailsService {

    @Autowired
    private IAppUserRepository iAppUserRepository;
    @Autowired
    private IUserRoleRepository iUserRoleRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser appUser = this.iAppUserRepository.getAppUserByUsername(username);
        if (appUser == null){
            throw new UsernameNotFoundException("User " + username + " was not found in the database");
        }
        List<UserRole> userRoles = this.iUserRoleRepository.findAllByAppUser(appUser);
        List<GrantedAuthority> grantList = new ArrayList<GrantedAuthority>();
        if (userRoles != null) {
            for (UserRole userRole : userRoles) {
                // ROLE_USER, ROLE_ADMIN,..
                GrantedAuthority authority = new SimpleGrantedAuthority(userRole.getAppRole().getRoleName());
                grantList.add(authority);
            }
        }
        return new User(appUser.getUserName(), appUser.getPassword(), grantList);
    }

}
