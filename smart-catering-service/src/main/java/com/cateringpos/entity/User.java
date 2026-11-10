package com.cateringpos.entity;

import com.cateringpos.enums.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, length = 25)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Role role;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "branch_id", length = 50)
    private String branchId = "MAIN";

    public String getPassword() {
        return passwordHash;
    }

    public void setPassword(String password) {
        this.passwordHash = password;
    }

    @Builder
    public User(Long id, String username, String email, String passwordHash, String password,
            String fullName, String phone, Role role, Boolean active, String branchId) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = password != null ? password : passwordHash;
        this.fullName = fullName;
        this.phone = phone;
        this.role = role;
        this.active = active != null ? active : true;
        this.branchId = branchId != null ? branchId : "MAIN";
    }
}
