import React, { useState } from 'react';
import { Flex, Switch, Stack, Container, Skeleton } from '@mantine/core';
import { Plan } from './Plan';
import { usePlanDetails } from '@hooks/usePlanDetails';

interface PlansProps {
  profile: IProfileData;
}

export const Plans = ({ profile }: PlansProps) => {
  const plans = {
    monthly: [
      {
        name: 'Sandbox',
        code: 'SANDBOX',
        rowsIncluded: 5000,
        price: 0,
        extraChargeOverheadTenThusandRecords: 1,
        removeBranding: false,
        customValidation: false,
        outputCustomization: false,
      },
      {
        name: 'Starter',
        code: 'starter-monthly',
        rowsIncluded: 5000,
        price: 0,
        extraChargeOverheadTenThusandRecords: 1,
        removeBranding: false,
        customValidation: false,
        outputCustomization: false,
      },
      {
        name: 'Growth',
        code: 'growth-monthly',
        price: 42,
        rowsIncluded: 500000,
        extraChargeOverheadTenThusandRecords: 0.7,
        removeBranding: true,
        customValidation: true,
        outputCustomization: true,
      },
      {
        name: 'Scale',
        code: 'scale-monthly',
        price: 90,
        rowsIncluded: 1500000,
        extraChargeOverheadTenThusandRecords: 0.5,
        removeBranding: true,
        customValidation: true,
        outputCustomization: true,
      },
    ],
    yearly: [
      {
        name: 'Sandbox',
        code: 'SANDBOX',
        rowsIncluded: 5000,
        price: 0,
        extraChargeOverheadTenThusandRecords: 1,
        removeBranding: false,
        customValidation: false,
        outputCustomization: false,
      },
      {
        name: 'Starter',
        code: 'starter-yearly',
        price: 0,
        rowsIncluded: 5000,
        extraChargeOverheadTenThusandRecords: 1,
        removeBranding: false,
        customValidation: false,
        outputCustomization: false,
      },
      {
        name: 'Growth',
        code: 'growth-yearly',
        price: 35,
        rowsIncluded: 500000,
        extraChargeOverheadTenThusandRecords: 0.7,
        removeBranding: true,
        customValidation: true,
        outputCustomization: true,
      },
      {
        name: 'Scale',
        description: 'scale-yearly',
        price: 75,
        rowsIncluded: 1500000,
        extraChargeOverheadTenThusandRecords: 0.5,
        removeBranding: true,
        customValidation: true,
        outputCustomization: true,
      },
    ],
  };
  const [switchPlans, setSwitchPlans] = useState<boolean>(false);
  const { activePlanDetails, isActivePlanLoading } = usePlanDetails({
    email: profile.email,
  });

  return (
    <Container size="xl" fluid={true}>
      <Stack align="center">
        <Switch
          size="lg"
          label="Yearly"
          checked={switchPlans}
          onChange={(event) => setSwitchPlans(event.currentTarget.checked)}
        />
        <Flex w="100%" gap="sm" direction="row" align="stretch" maw="100%">
          {plans[switchPlans ? 'yearly' : 'monthly'].map((plan, index) =>
            isActivePlanLoading ? (
              <Skeleton key={index} height={500} width={250} />
            ) : (
              <Plan
                key={index}
                name={plan.name}
                rowsIncluded={plan.rowsIncluded}
                price={plan.price}
                planCode={activePlanDetails?.plan.code}
                isActive={activePlanDetails?.isActive && activePlanDetails.plan.code === plan.code}
                userProfile={profile}
                showButton={plan.code !== 'SANDBOX'}
                removeBranding={plan.removeBranding}
                customValidation={plan.customValidation}
                outputCustomization={plan.outputCustomization}
                extraCharge={plan.extraChargeOverheadTenThusandRecords}
              />
            )
          )}
        </Flex>
      </Stack>
    </Container>
  );
};

export default Plans;
