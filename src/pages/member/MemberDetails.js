const MemberDetails = ({ myPageData }) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold">Member Details</h2>
      <div className="bg-gray-100 p-4 rounded shadow">
        <p>
          <strong>Name:</strong> {myPageData.member.name}  {/* 사용자 이름 */}
        </p>
        <p>
          <strong>Email:</strong> {myPageData.member.email}  {/* 사용자 이메일 */}
        </p>
      </div>
    </div>
  );
};

export default MemberDetails; 