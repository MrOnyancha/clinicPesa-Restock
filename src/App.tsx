// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authRoutes, hiddenRoutes, sidebarModules } from './routes/sideBarModules';
import { QueryClient } from '@tanstack/react-query';
import BlankLayout from './layouts/BlankLayout';
import { PrivateRoute } from './routes/PrivateRoutes';
import type { HiddenRoutesType, SidebarModulesInterface, SubModule } from './components/types/sideBar';
import { Toaster } from 'sonner';
import Cookies from 'js-cookie';

const queryClient = new QueryClient();

const renderNestedRoutes = (modules: SubModule[]) => {
  return modules.flatMap((data, i) => {
    if (data.hidden) return [];

    if (data.child) {
      return data.child.flatMap((prop, childIndex) => {
        if (prop.offsprings) {
          return prop.offsprings.map((lastChild, j) => {
            const LastChildComponent = lastChild.element;
            return (
              <Route
                key={childIndex * 1000 + j}
                path={lastChild.path}
                element={<LastChildComponent />}
              />
            );
          });
        } else if (prop.element) {
          const PropComponent = prop.element;
          return <Route key={childIndex} path={prop.path} element={<PropComponent />} />;
        } else {
          return null;
        }
      });
    } else if (data.element) {
      const Component = data.element;
      return <Route key={i} path={data.path} element={<Component />} />;
    } else {
      return null;
    }
  });
};


const renderRoutes = (modules: SidebarModulesInterface[]) => {
  return modules.map((module, index) => {
    if (module.hidden) return null;

    if (module.modules && module.modules.length > 0) {
      return renderNestedRoutes(module.modules);
    } else {
      return module.element ? <Route key={index} path={module.path} element={<module.element />} /> : null;
    }
  })
}

const App = () => {

  const routes = sidebarModules();

  return (
    <div>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route element={<BlankLayout />}>
          {authRoutes.map((prop, i) => {
            return <Route key={i} path={prop.path} element={<prop.element />} />;
          })}
        </Route>
        <Route element={<PrivateRoute />}>
          {hiddenRoutes.map((el: HiddenRoutesType, idx) => {
            return <Route key={idx} element={<el.element />} path={el.path} />;
          })}
          {renderRoutes(routes)}
        </Route>
        <Route
          path="*"
          element={
            Cookies.get('t_k')
              ? <Navigate to="/dashboard" />
              : <Navigate to="/auth/login" />
          }
        />

      </Routes>
    </div>
  );
}

export default App;
