import { useUser } from '@/lib/auth';
import React from 'react';

/**
 * Custom hook to check user authorization
 * @returns {Object} An object containing the checkAccess function and the user's role
 */
export const useAuthorization = () => {
    const user = useUser();

    if (!user.data) {
        throw Error('User does not exist!');
    }
    /**
     * Check if the user has access to the given roles
     * @param allowedRoles - The roles that the user is allowed to access
     * @returns true if the user has access to the given roles, false otherwise
     */
    const checkAccess = React.useCallback(
        ({ allowedRoles }: { allowedRoles: number[] }) => {
            if (allowedRoles && allowedRoles.length > 0 && user.data) {
                if (!user.data) {
                    return false;
                }
                // check if the user has any of the allowed roles
                return allowedRoles.some((role) => user.data!.groups.includes(role));
            }

            return true;
        },
        [user.data],
    );

    return { checkAccess, role: user.data?.groups, authenticated: user.data !== null };
};

type AuthorizationProps = {
    forbiddenFallback?: React.ReactNode;
    children: React.ReactNode;
} & (
    | {
          allowedRoles: number[];
          policyCheck?: never;
      }
    | {
          allowedRoles?: never;
          policyCheck: boolean;
      }
);

/**
 * Authorization component to check if the user has access to the given roles or policy
 * @param {Object} props - The props for the Authorization component
 * @param {React.ReactNode} props.forbiddenFallback - The fallback component to render if the user does not have access
 * @param {React.ReactNode} props.children - The component to render if the user has access
 * @returns {React.ReactNode} The component to render
 */
export const RoleGuard = ({ policyCheck, allowedRoles, forbiddenFallback = null, children }: AuthorizationProps) => {
    const { checkAccess } = useAuthorization();

    let canAccess = false;

    if (allowedRoles) {
        canAccess = checkAccess({ allowedRoles });
    }

    if (typeof policyCheck !== 'undefined') {
        canAccess = policyCheck;
    }

    return <>{canAccess ? children : forbiddenFallback}</>;
};
