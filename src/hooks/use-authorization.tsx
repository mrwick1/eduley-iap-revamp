import { useUser } from '@/lib/auth';
import React from 'react';

export const useAuthorization = () => {
    const user = useUser();

    if (!user.data) {
        throw Error('User does not exist!');
    }

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

export const Authorization = ({
    policyCheck,
    allowedRoles,
    forbiddenFallback = null,
    children,
}: AuthorizationProps) => {
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
